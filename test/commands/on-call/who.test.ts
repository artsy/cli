import { expect, test } from "@oclif/test"

describe("on-call:who", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })

  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })

  test
    .nock("https://api.opsgenie.com/v2", api =>
      api
        .get(/\/schedules\/Test\/on-calls.*/)
        .reply(200, {
          data: {
            onCallParticipants: [
              { name: "devon@example.com" },
              { name: "jon@example.com" },
            ],
          },
        })
        .get("/users/devon@example.com")
        .reply(200, { data: { fullName: "Devon Blandin" } })
        .get("/users/jon@example.com")
        .reply(200, { data: { fullName: "Jon Allured" } })
    )
    .stdout()
    .command(["on-call:who", "--schedule=Test"])
    .it("runs hello", ctx => {
      expect(ctx.stdout).to.contain("Devon Blandin\nJon Allured")
    })
})
