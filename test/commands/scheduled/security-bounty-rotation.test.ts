import { expect, test } from "@oclif/test"
import { Config } from "../../../src/config"

const expectedPayload = JSON.stringify({
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
        expect(ctx.stdout.trim()).to.eq(expectedPayload)
      }
    )

  describe("when an Orbit rotation is configured", () => {
    const originalOrbitUrl = Config.orbitUrl
    const originalOrbitToken = Config.orbitToken
    const originalRotationId = Config.orbitSecurityBountyRotationId

    beforeEach(() => {
      Config.orbitUrl = () => "https://orbit.artsy.net"
      Config.orbitToken = () => "test-orbit-token"
      Config.orbitSecurityBountyRotationId = () => "rotation-789"
    })
    afterEach(() => {
      Config.orbitUrl = originalOrbitUrl
      Config.orbitToken = originalOrbitToken
      Config.orbitSecurityBountyRotationId = originalRotationId
    })

    test
      .nock("https://orbit.artsy.net", api =>
        api.get("/api/rotations/rotation-789/on-call").reply(200, {
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
      .command(["scheduled:security-bounty-rotation"])
      .it("resolves the responder from Orbit instead of Opsgenie", ctx => {
        expect(ctx.stdout.trim()).to.eq(expectedPayload)
      })
  })
})
