defmodule Mailish.UserController do
  use Mailish.Web, :controller

  alias Mailish.User

  plug :scrub_params, "user" when action in [:create, :update]

  defp hash_password(password) do
    Comeonin.Bcrypt.hashpwsalt(password)
  end

  def index(conn, _params) do
    users = Repo.all(User)
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    import Ecto.Changeset, only: [put_change: 3]
    changeset = User.changeset(%User{}, user_params)
    changeset = put_change(changeset, :hashed_password, hash_password(changeset.params["password"]))

    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> put_session(:user_id, user.id)
        |> put_session(:loged_in, true)
        |> render("authenticated.json", %{})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mailish.ChangesetView, "error.json", changeset: changeset)
    end
  end

  defp deleted_login_session(conn) do
    conn
    |> delete_session(:user_id)
    |> delete_session(:loged_in)
  end

  def login(conn, %{"user" => user_params}) do
    user = Repo.get_by(User, name: user_params["name"])
    if user == nil do
      conn
      |> put_status(401)
      |> deleted_login_session
      |> render("error.json", message: "no user named #{user_params["name"]}")
    end
    case Comeonin.Bcrypt.checkpw(user_params["password"], user.hashed_password) do
      true ->
        conn
        |> put_session(:user_id, user.id)
        |> put_session(:loged_in, true)
        |> render("authenticated.json", %{})
      _ ->
        conn
        |> put_status(401)
        |> deleted_login_session
        |> render("error.json", message: "wrong password")
    end
  end

  def logout(conn, _params) do
    case get_session(conn, :loged_in) do
      true ->
        conn
        |> deleted_login_session
        |> render("logout.json", %{})
      _ ->
        conn
        |> put_status(401)
        |> render("error.json", message: "not loged in")
    end
  end

  def show(conn, %{"id" => id}) do
    user = Repo.get!(User, id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Repo.get!(User, id)
    changeset = User.changeset(user, user_params)

    case Repo.update(changeset) do
      {:ok, user} ->
        render(conn, "show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Mailish.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Repo.get!(User, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(user)

    send_resp(conn, :no_content, "")
  end
end
