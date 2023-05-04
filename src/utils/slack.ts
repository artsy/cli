import { WebClient } from "@slack/client"
import { Config } from "../config"

const convertEmailsToSlackMentions = async (emails: string[]) => {
  const slackToken = Config.slackWebApiToken()

  if (!slackToken) {
    throw new Error(
      "A Slack web api token was not found in the environment or config file."
    )
  }

  const web = new WebClient(slackToken)
  const users = await Promise.all(
    emails.map(email => web.users.lookupByEmail({ email }))
  )

  return users
    .filter(r => r.ok) // Filter out any failed lookups.
    .map((response: any) => response.user.id as string)
    .map(id => `<@${id}>`) // See: https://api.slack.com/docs/message-formatting#linking_to_channels_and_users
}

export { convertEmailsToSlackMentions }
