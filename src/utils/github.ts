import { graphql } from "@octokit/graphql"

interface Issue {
  title: string
  url: string
  author: {
    url: string
    login: string
    avatarURL: string
  }
}

interface OpenRFCsGraphQLSearchResponse {
  edges: Array<{ node: Issue }>
}

export class GitHub {
  apiKey: string

  constructor() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN env var required")
    }

    this.apiKey = process.env.GITHUB_TOKEN
  }

  async openRFCs(): Promise<Issue[]> {
    const { search }: { search: OpenRFCsGraphQLSearchResponse } = await graphql(
      `
        {
          search(
            query: "org:Artsy label:RFC state:open"
            type: ISSUE
            first: 100
          ) {
            edges {
              node {
                ... on Issue {
                  title
                  url
                  author {
                    login
                    url
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      `,
      {
        headers: {
          authorization: `token ${this.apiKey}`,
        },
      }
    )

    return search.edges.map(edge => edge.node)
  }
}
