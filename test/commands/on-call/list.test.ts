import { expect, test } from "@oclif/test"

describe("on-call:list", () => {
  beforeEach(() => {
    process.env.OPSGENIE_API_KEY = "test"
  })

  afterEach(() => {
    delete process.env.OPSGENIE_API_KEY
  })

  test
    .nock("https://api.opsgenie.com/v2", api =>
      api
        .get("/users")
        .reply(200, {
          data: [
            { username: "devon@example.com" },
            { username: "jon@example.com" },
          ],
        })
        .get("/users/devon@example.com")
        .reply(200, { data: { fullName: "Devon Blandin" } })
        .get("/users/jon@example.com")
        .reply(200, { data: { fullName: "Jon Allured" } })
    )
    .stdout()
    .command(["on-call:list"])
    .it("returns users from OpsGenie", ctx => {
      expect(ctx.stdout.trim()).to.eq("Devon Blandin\nJon Allured")
    })

  test
    .nock("https://api.opsgenie.com/v2", api =>
      api
        .get("/users")
        .reply(200, {
          data: [
            { username: "devon@example.com" },
            { username: "jon@example.com" },
          ],
        })
        .get("/users/devon@example.com")
        .reply(200, { data: { fullName: "Devon Blandin" } })
        .get("/users/jon@example.com")
        .reply(200, { data: { fullName: "Jon Allured" } })
    )
    .stdout()
    .command(["on-call:list", "--split", "2"])
    .it("supports a --split flag to group users", ctx => {
      expect(ctx.stdout.trim()).to.eq("Devon Blandin\n\nJon Allured")
    })
})
