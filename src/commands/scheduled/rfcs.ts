import { Command } from "@oclif/command"
import {
  OpenRequestsForComments,
  OpenRequestsForCommentsQuery,
} from "../../__generated__/graphql"
import { githubClient } from "../../utils/github"

export default class RFCs extends Command {
  static description = "lists open RFCs"

  static SearchURL =
    "https://github.com/search?q=org:Artsy+label:RFC+state:open"

  async run() {
    require("dotenv").config()

    const {
      data: { search },
    } = await githubClient().query<OpenRequestsForCommentsQuery>({
      query: OpenRequestsForComments,
    })

    const blocks = []

    if (search.issueCount === 0) {
      blocks.push({
        type: "section",
        text: {
          type: "plain_text",
          text: "No open RFCs this week",
        },
      })
      this.log(JSON.stringify({ blocks }))
      return
    } else {
      let text: string
      if (search.issueCount === 1) {
        text = `There is <${RFCs.SearchURL}|*1 open RFC*>:`
      } else {
        text = `There are <${RFCs.SearchURL}|*${search.issueCount} open RFCs*>:`
      }
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      })
    }

    search.nodes?.forEach((issue, index) => {
      if (
        issue?.__typename === "Issue" ||
        issue?.__typename === "PullRequest"
      ) {
        let issueText = `<${issue.url}|${issue.title}>`

        if (issue.timelineItems.nodes?.length) {
          const comment = issue.timelineItems.nodes[0]
          if (comment?.__typename === "IssueComment") {
            issueText += `\n\n:speech_balloon: _Last comment <!date^${this.convertTimestampToEpoch(
              comment.createdAt
            )}^{date_short_pretty}^${comment.url}|${comment.createdAt}> by <${
              comment.author?.url
            }|${comment.author?.login}>_`
          }
        }

        blocks.push(
          ...[
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: issueText,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "image",
                  image_url: issue.author?.avatarUrl,
                  alt_text: issue.author?.login,
                },
                {
                  type: "mrkdwn",
                  text: `Created by <${issue.author?.url}|${
                    issue.author?.login
                  }> on <!date^${this.convertTimestampToEpoch(
                    issue.createdAt
                  )}^{date_short_pretty}|${issue.createdAt}> / ${
                    issue.participants.totalCount
                  } participants`,
                },
              ],
            },
          ]
        )

        if (index < search.issueCount - 1) {
          blocks.push({ type: "divider" })
        }
      }
    })

    const payload = JSON.stringify({
      blocks,
    })

    this.log(payload)
  }

  convertTimestampToEpoch(timestamp: string) {
    return +Date.parse(timestamp) / 1000
  }
}
