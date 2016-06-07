defmodule Mailish.ApiView do
  use Mailish.Web, :view

  def render("mail.json", %{user: user}) do
    %{data: render_one(user, Mailish.UserView, "user.json")}
  end

  def render("sent_mail.json", %{
      sent: sent,
      page_number: page_number,
      total_page: total_page,
      total_entries: total_entries}) do
    %{
      page_number: page_number,
      entries: render_many(sent, Mailish.ApiView, "sent_mail_item.json"),
      total_page: total_page,
      total_entries: total_entries
    }
  end

  def render("mails.json", %{
      mails: mails,
      page_number: page_number,
      total_page: total_page,
      total_entries: total_entries}) do
    %{
      page_number: page_number,
      entries: render_many(mails, Mailish.ApiView, "mail_item.json"),
      total_page: total_page,
      total_entries: total_entries
    }
    end

  def render("mail_item.json", %{api: mail}) do
    %{
      subject: mail.subject,
      from: mail.from,
      content: mail.content,
      inserted_at: mail.inserted_at
    }
  end

  def render("sent_mail_item.json", %{api: sent}) do
    %{
      subject: sent.subject,
      to: sent.to,
      content: sent.content,
      inserted_at: sent.inserted_at
    }
  end

  def render("error.json", %{message: message}) do
    %{error: message}
  end
end
