import { expect, test } from "@oclif/test"
import { OpenRequestsForCommentsFixture } from "../../fixtures/open-rfcs"

describe("scheduled:rfcs", () => {
  test
    .nock("https://api.github.com", api =>
      api.post("/graphql").reply(200, OpenRequestsForCommentsFixture)
    )
    .stdout()
    .command(["scheduled:rfcs"])
    .it("returns Slack-formatted open RFCs message", ctx => {
      expect(ctx.stdout.trim()).to.eq(
        JSON.stringify({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  "There is <https://github.com/search?q=org:Artsy+label:RFC+state:open|*1 open RFC*>:",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  "<https://github.com/artsy/README/pull/368|RFC: Propose conventions for project set-up and configuration>\n\n:speech_balloon: _Last comment <!date^1612916446^{date_short_pretty}^https://github.com/artsy/README/issues/364#issuecomment-776012598|2021-02-10T00:20:46Z> by <https://github.com/dblandin|dblandin>_",
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "image",
                  image_url:
                    "https://avatars.githubusercontent.com/u/28120?u=cdbf28a4a864baaef4ef0e054b60bd5d5517a87b&v=4",
                  alt_text: "joeyAghion",
                },
                {
                  type: "mrkdwn",
                  text:
                    "Created by <https://github.com/joeyAghion|joeyAghion> on <!date^1612792734^{date_short_pretty}|2021-02-08T13:58:54Z> / 6 participants",
                },
              ],
            },
          ],
        })
      )
    })
})
