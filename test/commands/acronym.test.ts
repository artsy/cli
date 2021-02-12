import { expect, test } from "@oclif/test"

describe("acronym", () => {
  test
    .stdout()
    .command(["acronym", "AOV"])
    .it("describes known acronyms", ctx => {
      expect(ctx.stdout).to.contain("Average Order Value")
    })

  test
    .stdout()
    .command(["acronym", "THBBFT"])
    .it("does not describe unknown acronyms", ctx => {
      expect(ctx.stdout).to.contain("unknown acronym")
    })

  test
    .stdout()
    .command(["acronym", "aov"])
    .it("is case-insensitive", ctx => {
      expect(ctx.stdout).to.contain("Average Order Value")
    })

  test
    .stdout()
    .command(["tla", "aov"])
    .it("is aliased to tla", ctx => {
      expect(ctx.stdout).to.contain("Average Order Value")
    })

  test
    .stdout()
    .command(["wtf", "aov"])
    .it("is aliased to wtf", ctx => {
      expect(ctx.stdout).to.contain("Average Order Value")
    })
})
