import { expect, test } from "@oclif/test"
import { RepositoriesFixture } from "../../fixtures/repositories"

describe("scheduled:rfcs", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test"
  })

  afterEach(() => {
    delete process.env.GITHUB_TOKEN
  })

  test
    .nock("https://api.github.com", api =>
      api.post("/graphql").reply(200, RepositoriesFixture)
    )
    .stdout()
    .command(["audit:repositories", "--csv"])
    .it("lists repositories in the artsy github org", ctx => {
      expect(ctx.stdout.trim()).to.eq("Name,Default Branch\neigen,master")
    })
})
