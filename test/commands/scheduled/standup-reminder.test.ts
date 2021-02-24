import { expect, test } from "@oclif/test"

describe("scheduled:standup-reminder", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })
  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })
  test
    .nock("https://api.opsgenie.com", api =>
      api.get(/\/v2\/schedules\/.*\/on-calls.*/).reply(200, {
        data: {
          onCallParticipants: [
            { name: "devon@example.com" },
            { name: "jon@example.com" },
          ],
        },
      })
    )
    .nock("https://slack.com/api", api =>
      api
        .post("/users.lookupByEmail", /email=devon%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "devon",
          },
        })
        .post("/users.lookupByEmail", /email=jon%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "jon",
          },
        })
    )
    .stdout()
    .command(["scheduled:standup-reminder"])
    .it("returns Slack-formatted standup reminder message", ctx => {
      expect(ctx.stdout.trim()).to.eq(
        JSON.stringify({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  "Hi <@devon> and <@jon> :wave:\n\nBased on our <https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c|on-call schedule>, you've been chosen to facilitate today's Engineering Standup at 12pm ET. Please refer to the docs <https://github.com/artsy/README/blob/master/events/open-standup.md|on GitHub> and add new standup notes <https://www.notion.so/artsy/Standup-Notes-28a5dfe4864645788de1ef936f39687c|in Notion>.",
              },
            },
          ],
        })
      )
    })
})
