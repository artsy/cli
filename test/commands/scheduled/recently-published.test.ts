import * as path from "path"
import { expect, test } from "@oclif/test"

describe("scheduled:recently-published", () => {
  const fixture = path.resolve(__dirname, "../../fixtures/podcast.xml")
  test
    .nock("https://artsy.github.io", api =>
      api.get("/podcast.xml").replyWithFile(200, fixture)
    )
    .stdout()
    .command(["scheduled:recently-published"])
    .it("shares most recent podcast episode", ctx => {
      expect(ctx.stdout.trim()).to.include(
        JSON.stringify({
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "The last episode of *Artsy Engineering Radio* aired on Dec 17, 2020:",
          },
        })
      )
    })
})
