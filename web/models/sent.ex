defmodule Mailish.Sent do
  use Mailish.Web, :model

  schema "sent" do
    field :subject, :string
    field :to, {:array, :string}
    field :content, :string
    field :created_at, Ecto.DateTime
    belongs_to :user, Mailish.User

    timestamps
  end

  @required_fields ~w(subject to content)
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
