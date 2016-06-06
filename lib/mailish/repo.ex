defmodule Mailish.Repo do
  use Ecto.Repo, otp_app: :mailish
  use Scrivener, page_size: Application.get_env(:mailish, :pagination)[:per_page]
end
