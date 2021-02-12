import { Command } from "@oclif/command"
import {
  OpenRequestsForComments,
  OpenRequestsForCommentsQuery,
} from "../../__generated__/graphql"
import { githubClient } from "../../utils/github"

export default class RFCs extends Command {
  static description = "lists open RFCs"

  async run() {
    require("dotenv").config()

    const { data: { search }} = await githubClient().query<OpenRequestsForCommentsQuery>({
      query: OpenRequestsForComments,
    });

    if (search.issueCount === 0) {
      const payload = JSON.stringify({
        text: `No open RFCs this week.`,
      })
      this.log(payload)
      return
    }

    const attachments = search.nodes?.map(issue => {
      if (issue?.__typename === "Issue" || issue?.__typename === "PullRequest") {
        return {
          fallback: "Open RFCs",
          color: "#36a64f",
          author_name: issue.author?.login,
          author_link: issue.author?.url,
          author_icon: issue.author?.avatarUrl,
          title: issue.title,
          title_link: issue.url,
        }
      }
    })

    const text =
      search.issueCount === 1
        ? `There is one open RFC:`
        : `There are ${search.issueCount} open RFCs:`

    const payload = JSON.stringify({
      text,
      attachments,
      unfurl_links: false,
    })

    this.log(payload)
  }
}
