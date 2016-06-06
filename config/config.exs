# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :mailish, Mailish.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "some_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_heresome_craizy_things_here",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: Mailish.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false


config :mailish, :mailgun,
  apikey: "key-7e0bd21871baa01ef4be06773f1844cd",
  domain: "mailguntest.shenli.me"

config :mailish, :fallback_name, "eric"

config :mailish, :pagination,
  per_page: 10
