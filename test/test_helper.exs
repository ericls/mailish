ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Mailish.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Mailish.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Mailish.Repo)

