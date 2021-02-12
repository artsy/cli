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
            __typename: "SearchResultItemConnection",
            issueCount: 1,
            nodes: [{
              __typename: "Issue",
              author: {
                __typename: "User",
                login: "dblandin",
                avatarUrl: "https://example.com/avatar.jpg",
                url: "https://example.com/dblandin"
              },
              title: "Test",
              url: "https://example.com/issues/1"
            }],
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
              author_name: "dblandin",
              author_link: "https://example.com/dblandin",
              author_icon: "https://example.com/avatar.jpg",
              title: "Test",
              title_link: "https://example.com/issues/1"
            },
          ],
          unfurl_links: false,
        })
      )
    })
})
