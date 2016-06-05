defmodule Mailish.PageController do
  use Mailish.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
