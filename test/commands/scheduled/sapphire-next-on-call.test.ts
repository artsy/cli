import { expect, test } from "@oclif/test"

describe("scheduled:sapphire-next-on-call", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })
  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })
  test
    .nock("https://api.opsgenie.com", (api) =>
      api.get(/\/v2\/schedules\/.*\/next-on-calls.*/).reply(200, {
        data: {
          exactNextOnCallRecipients: [{ name: "justin@example.com" }],
        },
      })
    )
    .nock("https://slack.com/api", (api) =>
      api
        .post("/users.lookupByEmail", /email=justin%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "justin",
          },
        })
    )
    .stdout()
    .command(["scheduled:sapphire-next-on-call"])
    .it(
      "returns Slack-formatted upcoming on-call shift reminder message",
      (ctx) => {
        expect(ctx.stdout.trim()).to.eq(
          JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "<@justin> you're scheduled to run the Sapphire ceremonies, excluding retro, for the upcoming week!",
                },
              },
            ],
          })
        )
      }
    )
})
