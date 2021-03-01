import { Command } from "@oclif/command"
import Parser = require("rss-parser")

export default class ScheduledRecentlyPublished extends Command {
  static description =
    "Describe our most recently published articles and podcast episodes"

  async run() {
    const podcast = await this.buildPodcastSummary()
    const callToAction = this.buildCallToAction()

    const response = {
      blocks: [...podcast, ...callToAction],
    }

    this.log(JSON.stringify(response))
  }

  async buildPodcastSummary() {
    const PODCAST_FEED_URL = "https://artsy.github.io/podcast.xml"

    const parser = new Parser()
    const feed = await parser.parseURL(PODCAST_FEED_URL)

    const lastEpisode = feed.items[feed.items.length - 1]
    const {
      title,
      content,
      pubDate,
      itunes: { author },
    } = lastEpisode
    const formattedDate = new Date(pubDate!).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `The last episode of *Artsy Engineering Radio* aired on ${formattedDate}:`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${title} | <https://podcasts.apple.com/us/podcast/artsy-engineering-radio/id1545870104|Apple Podcasts> | <https://podcasts.google.com/feed/aHR0cHM6Ly9hcnRzeS5naXRodWIuaW8vcG9kY2FzdC54bWw|Google Podcasts> | <https://open.spotify.com/show/0gJYxpqN6P11dbjNw8VT2a?si=L4TWDrQETwuVO6JR1SOZTQ|Spotify>`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> ${content}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `${author} - ${formattedDate}`,
          },
        ],
      },
    ]

    return blocks
  }

  buildCallToAction() {
    return [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Have an idea for a blog post or podcast episode? Swing by the #blogging/#engineering-podcast channels anytime. We also have Writing Office Hours every Monday at 2pm ET.",
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text:
              "<https://artsy.github.io|Artsy Engineering> | Podcast (<https://podcasts.apple.com/us/podcast/artsy-engineering-radio/id1545870104|iTunes>, <https://podcasts.google.com/feed/aHR0cHM6Ly9hcnRzeS5naXRodWIuaW8vcG9kY2FzdC54bWw|Google>)",
          },
        ],
      },
    ]
  }
}
