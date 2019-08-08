import { expect, test } from "@oclif/test"

describe("login", () => {
  test
    .stdout()
    .command(["login"])
    .it("lets the user know where it is authenticating", ctx => {
      expect(ctx.stdout).to.contain(
        "Authenticating against stagingapi.artsy.net"
      )
    })
})
