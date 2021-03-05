import * as path from "path"
import { expect, test } from "@oclif/test"

describe("scheduled:recently-published", () => {
  const blogFixture = path.resolve(__dirname, "../../fixtures/feed.xml")
  const podcastFixture = path.resolve(__dirname, "../../fixtures/podcast.xml")

  test
    .nock("https://artsy.github.io", api => {
      api.get("/feed.xml").replyWithFile(200, blogFixture)
      api.get("/podcast.xml").replyWithFile(200, podcastFixture)
    })
    .stdout()
    .command(["scheduled:recently-published"])
    .it("shares most recent blog posts", ctx => {
      const response = ctx.stdout.trim()

      expect(response).to.include(
        " days ago* we published our most recent article on the *Artsy Engineering Blog*. Here are our most recent posts -- read and share them!"
      )

      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "<https://artsy.github.io/blog/2020/12/31/echo-supporting-old-app-versions/|Echoes From the Past: Supporting Old App Versions>",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Dec 30, 2020",
            },
          ],
        })
      )
    })

  test
    .nock("https://artsy.github.io", api => {
      api.get("/feed.xml").replyWithFile(200, blogFixture)
      api.get("/podcast.xml").replyWithFile(200, podcastFixture)
    })
    .stdout()
    .command(["scheduled:recently-published"])
    .it("shares most recent podcast episode", ctx => {
      const response = ctx.stdout.trim()
      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "The last episode of *Artsy Engineering Radio* aired on Dec 17, 2020:",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "1: How To Have Good Meetings | <https://podcasts.apple.com/us/podcast/artsy-engineering-radio/id1545870104|Apple Podcasts> | <https://podcasts.google.com/feed/aHR0cHM6Ly9hcnRzeS5naXRodWIuaW8vcG9kY2FzdC54bWw|Google Podcasts> | <https://open.spotify.com/show/0gJYxpqN6P11dbjNw8VT2a?si=L4TWDrQETwuVO6JR1SOZTQ|Spotify>",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "> Ash Furrow talks with Steve Hicks about facilitating meaningful and inclusive team meetings, and how meetings are part of building teams, trust, and systems.",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Ash Furrow & Steve Hicks - Dec 17, 2020",
            },
          ],
        })
      )
    })

  test
    .nock("https://artsy.github.io", api => {
      api.get("/feed.xml").replyWithFile(200, blogFixture)
      api.get("/podcast.xml").replyWithFile(200, podcastFixture)
    })
    .stdout()
    .command(["scheduled:recently-published"])
    .it("lets people know how to contribute", ctx => {
      const response = ctx.stdout.trim()
      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "Have an idea for a blog post or podcast episode? Swing by the #blogging/#engineering-podcast channels anytime. We also have Writing Office Hours every Monday at 2pm ET.",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text:
                "<https://artsy.github.io|Artsy Engineering> | Podcast (<https://podcasts.apple.com/us/podcast/artsy-engineering-radio/id1545870104|iTunes>, <https://podcasts.google.com/feed/aHR0cHM6Ly9hcnRzeS5naXRodWIuaW8vcG9kY2FzdC54bWw|Google>)",
            },
          ],
        })
      )
    })
})
