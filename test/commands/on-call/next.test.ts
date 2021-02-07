import { expect, test } from "@oclif/test"

describe("on-call:next", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })

  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })

  test
    .nock("https://api.opsgenie.com/v2", api =>
      api
        .get(/\/schedules\/Test\/next-on-calls.*/)
        .reply(200, {
          data: {
            exactNextOnCallRecipients: [
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
    .command(["on-call:next", "--schedule=Test"])
    .it("return who's next on-call", ctx => {
      expect(ctx.stdout).to.contain("Devon Blandin\nJon Allured")
    })
})
