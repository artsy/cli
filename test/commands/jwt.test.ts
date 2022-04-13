import { expect, test } from "@oclif/test"

const FAKE_TOKEN =
  "eyJhbGciOiJ0ZXN0In0.eyJpc3MiOiJTa3luZXQiLCJpYXQiOjE2NDg2NTIyNTcsInJvbGVzIjoiaGF4MHIifQ.loljkjk"

describe("jwt", () => {
  test
    .stdout()
    .command(["jwt", FAKE_TOKEN])
    .it("decodes the header and payload but not the signature", ctx => {
      expect(ctx.stdout).to.contain("{ alg: 'test' }")
      expect(ctx.stdout).to.contain(
        "{ iss: 'Skynet', iat: 1648652257, roles: 'hax0r' }"
      )
    })
})
