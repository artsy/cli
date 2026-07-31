import { expect, test } from "@oclif/test"
import { Config } from "../../../src/config"

const expectedPayload = JSON.stringify({
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
        expect(ctx.stdout.trim()).to.eq(expectedPayload)
      }
    )

  describe("when an Orbit rotation is configured", () => {
    const originalOrbitUrl = Config.orbitUrl
    const originalOrbitToken = Config.orbitToken
    const originalRotationId = Config.orbitSapphireRetroRotationId

    beforeEach(() => {
      Config.orbitUrl = () => "https://orbit.artsy.net"
      Config.orbitToken = () => "test-orbit-token"
      Config.orbitSapphireRetroRotationId = () => "rotation-456"
    })
    afterEach(() => {
      Config.orbitUrl = originalOrbitUrl
      Config.orbitToken = originalOrbitToken
      Config.orbitSapphireRetroRotationId = originalRotationId
    })

    test
      .nock("https://orbit.artsy.net", api =>
        api.get("/api/rotations/rotation-456/on-call").reply(200, {
          current: {
            engineer: { id: "e1", email: "justin@example.com" },
            periodStart: "2026-01-01T00:00:00.000Z",
            periodEnd: "2026-01-08T00:00:00.000Z",
          },
          next: null,
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
        "resolves the on-call captain from Orbit instead of Opsgenie",
        ctx => {
          expect(ctx.stdout.trim()).to.eq(expectedPayload)
        }
      )
  })
})
