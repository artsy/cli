import { Command } from "@oclif/command"
import { GitHub } from "../../utils/github"

export default class RFCs extends Command {
  static description = "lists open RFCs"

  async run() {
    require("dotenv").config()

    const github = new GitHub()
    const issues = await github.openRFCs()

    if (issues.length === 0) {
      const payload = JSON.stringify({
        text: `No open RFCs this week.`,
      })
      this.log(payload)
      return
    }

    const attachments = issues.map(issue => ({
      fallback: "Open RFCs",
      color: "#36a64f",
      author_name: issue.author?.login,
      author_link: issue.author?.url,
      author_icon: issue.author?.avatarURL,
      title: issue.title,
      title_link: issue.url,
    }))

    const text =
      issues.length === 1
        ? `There is one open RFC:`
        : `There are ${issues.length} open RFCs:`

    const payload = JSON.stringify({
      text,
      attachments,
      unfurl_links: false,
    })

    this.log(payload)
  }
}
