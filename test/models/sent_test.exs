defmodule Mailish.SentTest do
  use Mailish.ModelCase

  alias Mailish.Sent

  @valid_attrs %{content: "some content", created_at: "2010-04-17 14:00:00", subject: "some content", to: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Sent.changeset(%Sent{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Sent.changeset(%Sent{}, @invalid_attrs)
    refute changeset.valid?
  end
end
