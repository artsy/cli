import { WebClient } from "@slack/client"

const convertEmailsToSlackMentions = async (emails: string[]) => {
  const slackToken = process.env.SLACK_WEB_API_TOKEN
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
