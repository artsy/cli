import { expect, test } from "@oclif/test"

describe("scheduled:facilitate-incident-review", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })
  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })
  test
    .nock("https://slack.com/api", api =>
      api.post("/users.lookupByEmail").reply(200, {
        ok: true,
        user: {
          id: "neo",
        },
      })
    )
    .stdout()
    .command([
      "scheduled:facilitate-incident-review",
      "--facilitatorEmail=neo@matrix.com",
    ])
    .it(
      "returns Slack-formatted upcoming facilitation reminder message with facilitatorEmail set",
      ctx => {
        expect(ctx.stdout.trim()).to.eq(
          JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text:
                    "<@neo> :wave:, based on the <https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c/main|on-call schedule> you have been selected to _prepare for and facilitate_ the Incident Review meeting tomorrow at 11AM ET! :tada:\nCheck out the <https://www.notion.so/artsy/Incident-Reviews-725052225efc49e78532b13e166ba3c7|Incident Review Schedule> for more information and the next steps.",
                },
              },
            ],
          })
        )
      }
    )

  test
    .nock("https://api.opsgenie.com", api =>
      api.get(/\/v2\/schedules\/.*\/on-calls.*/).reply(200, {
        data: {
          onCallParticipants: [
            { name: "neo@matrix.com" },
            { name: "trinity@matrix.com" },
          ],
        },
      })
    )
    .nock("https://slack.com/api", api =>
      api.post("/users.lookupByEmail").reply(200, {
        ok: true,
        user: {
          id: "neo",
        },
      })
    )
    .stdout()
    .command(["scheduled:facilitate-incident-review"])
    .it(
      "returns Slack-formatted upcoming facilitation reminder message",
      ctx => {
        expect(ctx.stdout.trim()).to.eq(
          JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text:
                    "<@neo> :wave:, based on the <https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c/main|on-call schedule> you have been selected to _prepare for and facilitate_ the Incident Review meeting tomorrow at 11AM ET! :tada:\nCheck out the <https://www.notion.so/artsy/Incident-Reviews-725052225efc49e78532b13e166ba3c7|Incident Review Schedule> for more information and the next steps.",
                },
              },
            ],
          })
        )
      }
    )
})
