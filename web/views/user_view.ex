defmodule Mailish.UserView do
  use Mailish.Web, :view

  def render("index.json", %{users: users}) do
    %{data: render_many(users, Mailish.UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, Mailish.UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      hashed_password: user.hashed_password}
  end
end
