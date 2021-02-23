import { Command } from "@oclif/command"
import Parser = require("rss-parser")
import fetch from "cross-fetch"

export default class ScheduledRecentlyPublished extends Command {
  static description =
    "Describe our most recently published articles and podcast episodes"

  async run() {
    const podcast = await this.getPodcastFeed()

    const response = {
      blocks: [...podcast],
    }

    this.log(JSON.stringify(response))
  }

  async getPodcastFeed() {
    const PODCAST_FEED_URL = "https://artsy.github.io/podcast.xml"

    const parser = new Parser()
    const feed = await parser.parseURL(PODCAST_FEED_URL)

    const last = feed.items[feed.items.length - 1]
    const lastPublishedDate = new Date(last.pubDate!).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    )

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `The last episode of *Artsy Engineering Radio* aired on ${lastPublishedDate}:`,
        },
      },
    ]

    return blocks
  }
}
