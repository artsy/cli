const OpenRequestsForCommentsFixture = {
  data: {
    search: {
      __typename: "SearchResultItemConnection",
      issueCount: 1,
      nodes: [
        {
          __typename: "PullRequest",
          createdAt: "2021-02-08T13:58:54Z",
          title:
            "RFC: Propose conventions for project set-up and configuration",
          url: "https://github.com/artsy/README/pull/368",
          author: {
            __typename: "User",
            avatarUrl:
              "https://avatars.githubusercontent.com/u/28120?u=cdbf28a4a864baaef4ef0e054b60bd5d5517a87b&v=4",
            login: "joeyAghion",
            url: "https://github.com/joeyAghion",
          },
          participants: {
            __typename: "UserConnection",
            totalCount: 6,
          },
          timelineItems: {
            __typename: "PullRequestTimelineItemsConnection",
            nodes: [
              {
                __typename: "IssueComment",
                createdAt: "2021-02-10T00:20:46Z",
                url:
                  "https://github.com/artsy/README/issues/364#issuecomment-776012598",
                author: {
                  __typename: "User",
                  avatarUrl:
                    "https://avatars.githubusercontent.com/u/123595?u=0a060f4b635157739fcb60a044c4df4392c44054&v=4",
                  login: "dblandin",
                  url: "https://github.com/dblandin",
                },
              },
            ],
          },
        },
      ],
    },
  },
}

export { OpenRequestsForCommentsFixture }
