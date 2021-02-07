import { expect, test } from "@oclif/test"

describe("scheduled:rfcs", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test"
  })

  afterEach(() => {
    delete process.env.GITHUB_TOKEN
  })

  test
    .nock("https://api.github.com", api =>
      api.post("/graphql").reply(200, {
        data: {
          search: {
            edges: [
              {
                node: {
                  title: "Test",
                },
              },
            ],
          },
        },
      })
    )
    .stdout()
    .command(["scheduled:rfcs"])
    .it("returns Slack-formatted open RFCs message", ctx => {
      expect(ctx.stdout.trim()).to.eq(
        JSON.stringify({
          text: "There is one open RFC:",
          attachments: [
            {
              fallback: "Open RFCs",
              color: "#36a64f",
              title: "Test",
            },
          ],
          unfurl_links: false,
        })
      )
    })
})
