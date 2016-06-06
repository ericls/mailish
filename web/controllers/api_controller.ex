defmodule Mailish.ApiController do
  use Mailish.Web, :controller
  alias Mailish.User
  alias Mailish.Mail
  alias Mailish.Sent

  defp mailgun_header() do
    import Base
    %{"Authorization" => "Basic " <> Base.encode64("api:" <> Application.get_env(:mailish, :mailgun)[:apikey])}
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
end
