defmodule Mailish.Repo.Migrations.CreateMail do
  use Ecto.Migration

  def change do
    create table(:mails) do
      add :subject, :string
      add :from, :string
      add :content, :string
      add :created_at, :datetime
      add :user_id, references(:users, on_delete: :nothing)

      timestamps
    end
    create index(:mails, [:user_id])

  end
end
