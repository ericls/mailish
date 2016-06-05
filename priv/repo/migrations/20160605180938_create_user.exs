defmodule Mailish.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :hashed_password, :string

      timestamps
    end

  end
end
