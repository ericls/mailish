defmodule Mailish.Repo.Migrations.CreateSent do
  use Ecto.Migration

  def change do
    create table(:sent) do
      add :subject, :string
      add :to, {:array, :string}
      add :content, :string
      add :created_at, :datetime
      add :user_id, references(:users, on_delete: :nothing)

      timestamps
    end
    create index(:sent, [:user_id])

  end
end
