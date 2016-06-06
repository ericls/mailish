defmodule Mailish.Router do
  use Mailish.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :auth do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :require_login
  end

  def require_login(conn, _params) do
    import Plug.Conn
    case get_session(conn, :loged_in) do
      true ->
        conn
        |> assign(:user_id, get_session(conn, :user_id))
      _ ->
        conn
        |> send_resp(401, "Not authenticated.")
        |> halt
    end
  end

  scope "/", Mailish do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/auth", Mailish do
    pipe_through :auth
    resources "/users", UserController, only: [:create, :show]
    post "/login", UserController, :login
    post "/logout", UserController, :logout
  end

  scope "/api", Mailish do
    pipe_through :api
    post "/send", ApiController, :send_mail
  end

  # Other scopes may use custom stacks.
  # scope "/api", Mailish do
  #   pipe_through :api
  # end
end
