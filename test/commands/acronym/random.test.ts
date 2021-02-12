import { expect, test } from "@oclif/test"

describe("acronym:random", () => {
  test
    .stdout()
    .command(["acronym:random"])
    .it("returns a random acronym", ctx => {
      expect(ctx.stdout).to.match(/\w+:.+/)
    })
})
