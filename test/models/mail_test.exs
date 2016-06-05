defmodule Mailish.MailTest do
  use Mailish.ModelCase

  alias Mailish.Mail

  @valid_attrs %{content: "some content", created_at: "2010-04-17 14:00:00", from: "some content", subject: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Mail.changeset(%Mail{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Mail.changeset(%Mail{}, @invalid_attrs)
    refute changeset.valid?
  end
end
