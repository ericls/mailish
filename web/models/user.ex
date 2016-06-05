defmodule Mailish.User do
  use Mailish.Web, :model

  schema "users" do
    field :name, :string
    field :hashed_password, :string
    field :password, :string, virtual: true

    has_many :mails, Mailish.Mail
    timestamps
  end

  @required_fields ~w(name password)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:name)
  end

end
