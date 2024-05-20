import { expect, test } from "@oclif/test"

describe("scheduled:security-bounty-rotation", () => {
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
    .command(["scheduled:security-bounty-rotation"])
    .it(
      "returns Slack-formatted upcoming security bounty shift reminder message",
      ctx => {
        expect(ctx.stdout.trim()).to.eq(
          JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text:
                    "<@justin> you're scheduled to respond to bounty submissions in the upcoming week! Check out <https://www.notion.so/artsy/Security-Bounty-Program-Playbook-0071e3292a194f23b6a8ae593a08d3f3|the playbook> to prepare.",
                },
              },
            ],
          })
        )
      }
    )
})
