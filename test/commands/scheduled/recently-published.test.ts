import * as path from "path"
import { expect, test } from "@oclif/test"

describe("scheduled:recently-published", () => {
  const blogFixture = path.resolve(__dirname, "../../fixtures/feed.xml")
  const podcastFixture = path.resolve(__dirname, "../../fixtures/podcast.xml")

  test
    .nock("https://artsy.github.io", api => {
      api.get("/feed.xml").replyWithFile(200, blogFixture)
    })
    .nock("https://feeds.buzzsprout.com", buzzsprout => {
      buzzsprout.get("/1781859.rss").replyWithFile(200, podcastFixture)
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
              text: "Dec 31, 2020",
            },
          ],
        })
      )
    })

  test
    .nock("https://artsy.github.io", api => {
      api.get("/feed.xml").replyWithFile(200, blogFixture)
    })
    .nock("https://feeds.buzzsprout.com", buzzsprout => {
      buzzsprout.get("/1781859.rss").replyWithFile(200, podcastFixture)
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
              "The last episode of *Artsy Engineering Radio* aired on May 27, 2021:",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "19: Humanizing The Workplace | <https://podcasts.apple.com/us/podcast/artsy-engineering-radio/id1545870104|Apple Podcasts> | <https://podcasts.google.com/feed/aHR0cHM6Ly9hcnRzeS5naXRodWIuaW8vcG9kY2FzdC54bWw|Google Podcasts> | <https://open.spotify.com/show/0gJYxpqN6P11dbjNw8VT2a?si=L4TWDrQETwuVO6JR1SOZTQ|Spotify>",
          },
        })
      )
      expect(response).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "> <p>Steve Hicks and Justin Bennett talk about empathy in workplace culture, how to build trust and safety, and the importance of providing space for people.</p>",
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
                "Steve Hicks & Justin Bennett. Edited by Aja Simpson - May 27, 2021",
            },
          ],
        })
      )
    })

  test
    .nock("https://artsy.github.io", api => {
      api.get("/feed.xml").replyWithFile(200, blogFixture)
    })
    .nock("https://feeds.buzzsprout.com", buzzsprout => {
      buzzsprout.get("/1781859.rss").replyWithFile(200, podcastFixture)
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
              "Have an idea for a blog post or podcast episode? Swing by the #blogging/#engineering-podcast channels anytime. We also have Writing Office Hours every Tuesday at 11am ET.",
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
                "<https://artsy.github.io|Artsy Engineering> | <https://artsyengineeringradio.buzzsprout.com|Artsy Engineering Radio>",
            },
          ],
        })
      )
    })
})
