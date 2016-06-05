defmodule Mailish.User do
  use Mailish.Web, :model

  schema "users" do
    field :name, :string
    field :hashed_password, :string

    timestamps
  end

  @required_fields ~w(name hashed_password)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
