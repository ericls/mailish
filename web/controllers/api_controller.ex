defmodule Mailish.ApiController do
  use Mailish.Web, :controller
  alias Mailish.User
  alias Mailish.Mail
  alias Mailish.Sent

  defp mailgun_header() do
    import Base
    %{"Authorization" => "Basic " <> Base.encode64("api:" <> Application.get_env(:mailish, :mailgun)[:apikey])}
  end

  def login_status(conn, _params) do
    conn |> send_resp(200, 'ok') |> halt
  end

  def send_mail(conn, %{"mail" => mail}) do
    mailgun_domain = Application.get_env(:mailish, :mailgun)[:domain]
    user = Repo.get_by(Mailish.User, id: get_session(conn, :user_id))
    mail_data = [
      from: "#{user.name}<#{user.name}@#{mailgun_domain}>",
      to: mail["recipients"],
      subject: mail["subject"],
      html: mail["body"]
    ]
    case HTTPoison.post(
      "https://api.mailgun.net/v3/#{mailgun_domain}/messages",
      {:form, mail_data},
      mailgun_header,
      [timeout: 20*1000]
    ) do
      {:ok, res} ->
        Repo.insert(
          %Sent{
            subject: mail_data[:subject],
            to: mail_data[:to],
            content: mail_data[:html],
            user_id: user.id
          }
        )
        conn
        |> send_resp(res.status_code, res.body)
        |> halt()
      {:error, err} ->
        IO.inspect err
        conn
        |> send_resp(500, "error when sending mail!")
        |> halt()
    end
  end

  def sent_mail(conn, params) do
    user = Repo.get_by(Mailish.User, id: get_session(conn, :user_id))
    import Ecto.Query, only: [from: 2]
    sent = from s in Sent,
                    where: s.user_id == ^user.id
    paginated = case params do
      %{"page" => page} ->
        sent |> paginate(page)
        _ ->
        sent |> paginate(1)
      end
    conn
    |> Scrivener.Headers.paginate(paginated)
    |> render(
      "sent_mail.json",
        sent: paginated.entries,
        page_number: paginated.page_number,
        total_page: paginated.total_pages,
        total_entries: paginated.total_entries
      )
  end

  def get_mails(conn, params) do
    user = Repo.get_by(Mailish.User, id: get_session(conn, :user_id))
    import Ecto.Query, only: [from: 2]
    mails = from m in Mail,
                  where: m.user_id == ^user.id
    paginated = case params do
      %{"page" => page} ->
        mails |> paginate(page)
      _ ->
        mails |> paginate(1)
    end
    conn
    |> Scrivener.Headers.paginate(paginated)
    |> render(
      "mails.json",
      mails: paginated.entries,
      page_number: paginated.page_number,
      total_page: paginated.total_pages,
      total_entries: paginated.total_entries
    )
  end

  def get_mail(conn, params) do
    user = Repo.get_by(Mailish.User, id: get_session(conn, :user_id))
    import Ecto.Query, only: [from: 2]
    case params do
      %{"type" => type, "id" => id} ->
        %{"type" => type, "id" => id} = params
      _ -> conn |> send_resp(400, "bad request") |> halt
    end
    mail = case type do
      "sent" ->
        Repo.get_by(Mailish.Sent, id: id)

      "mail" ->
          Repo.get_by(Mailish.Mail, id: id)
    end
    if mail.user_id != user.id do
      conn |> send_resp(403, "no no no") |> halt
    end
    view = case type do
      "mail" -> "mail_item.json"
      "sent" -> "sent_mail_item.json"
    end
    conn |> render(
      view,
      api: mail
    )

  end

  def mailgun_callback(conn, params) do
    case params do
      %{
        "recipient" => recipient,
        "subject" => subject,
        "sender" => sender,
        "stripped-text" => content
      } ->
        [to_name | _] = String.split(recipient, "@")
        {name, user_id} = case Repo.get_by(User, name: to_name) do
            %User{:id => user_id, :name => name} ->
              {name, user_id}
            nil ->
              fallback_name = Application.get_env(:mailish, :fallback_name)
              {
                fallback_name,
                Repo.get_by(User, name: fallback_name).id
              }
            end
        Repo.insert(
          %Mail{
            subject: subject,
            from: sender,
            content: content,
            user_id: user_id
          }
        )
        conn |> send_resp(200, "Sucess")
      _ ->
        conn |> send_resp(400, "hmm") |> halt
    end
  end

  defp paginate(query, page) do
    case is_integer(page) do
      false -> {page, _} = Integer.parse(page)
      _ -> page = page
    end
    query |> Repo.paginate(page: page)
  end
end
