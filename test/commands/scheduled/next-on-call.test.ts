import { expect, test } from "@oclif/test"

describe("scheduled:next-on-call", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })
  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })
  test
    .nock("https://api.opsgenie.com", api =>
      api.get(/\/v2\/schedules\/.*\/next-on-calls.*/).reply(200, {
        data: {
          exactNextOnCallRecipients: [
            { name: "justin@example.com" },
            { name: "steve@example.com" },
          ],
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
        .post("/users.lookupByEmail", /email=steve%40example.com/)
        .reply(200, {
          ok: true,
          user: {
            id: "steve",
          },
        })
    )
    .stdout()
    .command(["scheduled:next-on-call"])
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
                    "<@justin>, <@steve> looks like you have on-call shifts coming up! Check out the <https://www.notion.so/artsy/Incident-Handling-111cab0764a0808c993ec19b352cfab9?pvs=4#111cab0764a08052944df603067ca183|Incident Handling doc> to prep. You've got this! :+1:",
                },
              },
            ],
          })
        )
      }
    )
})
