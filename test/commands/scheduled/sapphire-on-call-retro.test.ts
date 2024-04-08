import { expect, test } from "@oclif/test"

describe("scheduled:sapphire-on-call-retro", () => {
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
          onCallParticipants: [{ name: "justin@example.com" }],
        },
      })
    )
    .nock("https://slack.com/api", api =>
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
    .command(["scheduled:sapphire-on-call-retro"])
    .it(
      "returns Slack-formatted upcoming on-call shift reminder message",
      ctx => {
        expect(ctx.stdout.trim()).to.eq(
          JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text:
                    "<@justin> you're scheduled to run Sapphire retro today! Check out the <https://www.notion.so/artsy/Retros-0b23b316be19470386ae0f550a57ab36|Retro info doc> to prepare.",
                },
              },
            ],
          })
        )
      }
    )
})
