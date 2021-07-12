import { Command } from "@oclif/command"
import Parser = require("rss-parser")

export default class ScheduledRecentlyPublished extends Command {
  static description =
    "Describe our most recently published articles and podcast episodes"

  async run() {
    const blog = await this.buildBlogSummary()
    const podcast = await this.buildPodcastSummary()
    const callToAction = this.buildCallToAction()

    const response = {
      blocks: [...blog, ...podcast, ...callToAction],
    }

    this.log(JSON.stringify(response))
  }

  async buildBlogSummary() {
    const BLOG_FEED_URL = "https://artsy.github.io/feed.xml"

    const parser = new Parser()
    const feed = await parser.parseURL(BLOG_FEED_URL)

    const mostRecentPost = feed.items[0]
    const { pubDate } = mostRecentPost
    const daysAgo = computeDaysAgo(pubDate)

    const threeMostRecentPosts = feed.items.slice(0, 3)
    const threeMostRecentPostBlocks = threeMostRecentPosts
      .map(this.buildBlogArticleBlocks)
      .flat()

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${daysAgo} days ago* we published our most recent article on the *Artsy Engineering Blog*. Here are our most recent posts -- read and share them!`,
        },
      },
      ...threeMostRecentPostBlocks,
    ]

    return blocks
  }

  buildBlogArticleBlocks(post: Parser.Item) {
    const { link, pubDate, title } = post
    const formattedDate = formatDate(pubDate)
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${link}|${title}>`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: formattedDate,
          },
        ],
      },
      {
        type: "divider",
      },
    ]
    return blocks
  }

  async buildPodcastSummary() {
    const PODCAST_FEED_URL = "https://feeds.buzzsprout.com/1781859.rss"

    const parser = new Parser()
    const feed = await parser.parseURL(PODCAST_FEED_URL)

    // Most recent episode is the first in the feed
    const lastEpisode = feed.items[0]
    const {
      title,
      content,
      pubDate,
      itunes: { author },
    } = lastEpisode
    const formattedDate = formatDate(pubDate)

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
            "Have an idea for a blog post or podcast episode? Swing by the #blogging/#engineering-podcast channels anytime. We also have Writing Office Hours every Tuesday at 11am ET.",
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

function computeDaysAgo(dateString: string | undefined) {
  if (dateString === undefined) {
    return "??"
  }

  const parsed = Date.parse(dateString)
  const now = Date.now()
  const diff = now - parsed
  const diffInDays = diff / (1000 * 3600 * 24)
  return Math.floor(diffInDays)
}

function formatDate(dateString: string | undefined) {
  if (dateString === undefined) {
    return "??"
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}
