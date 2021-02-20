import Command from "../../base"

import { WebClient } from "@slack/client"
import { Opsgenie } from "../../utils/opsgenie"

export default class StandupReminder extends Command {
  static urls: { [key: string]: string } = {
    onCallSchedule:
      "https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c",
    standup:
      "https://github.com/artsy/README/blob/master/events/open-standup.md",
    notes:
      "https://www.notion.so/artsy/Standup-Notes-28a5dfe4864645788de1ef936f39687c",
    engineeringSupport:
      "https://github.com/artsy/README/tree/master/playbooks/support#preparing-for-your-on-call-shift",
  }

  static description =
    "Remind facilitators and participants of upcoming standup."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const opsGenieOnCallStaffEmails = await this.onCallEmailsFromOpsGenie()
    const message = await this.messageForOnCallEmails(opsGenieOnCallStaffEmails)

    const opsGenieNextOnCallStaffEmails = await this.nextOnCallEmailsFromOpsGenie()
    const nextMessage = await this.messageForNextOnCallEmails(
      opsGenieNextOnCallStaffEmails
    )

    const payload = JSON.stringify({
      attachments: [
        {
          fallback: "Monday Standup",
          color: "#666",
          title: "Monday Standup",
          text: message,
        },
        {
          fallback: "Next On-call",
          color: "#666",
          title: "Next On-call",
          text: nextMessage,
        },
      ],
    })

    this.log(payload)
  }

  async onCallEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleOnCalls("Engineering On Call")

    return onCalls.data.onCallParticipants.map((participant: any) => {
      return participant.name
    })
  }

  async nextOnCallEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleNextOnCalls("Engineering On Call")

    return onCalls.data.exactNextOnCallRecipients.map((participant: any) => {
      return participant.name
    })
  }

  async messageForOnCallEmails(emails: string[]) {
    const mentions = await this.convertEmailsToSlackMentions(emails)

    return (
      `${mentions.join(", ")} based on our <${
        StandupReminder.urls.onCallSchedule
      }|on-call schedule>, ` +
      `you’ll be running the Monday standup at 12pm ET time. Here are the docs ` +
      `<${StandupReminder.urls.standup}|on GitHub>. ` +
      `Add new standup notes <${StandupReminder.urls.notes}|in Notion>.`
    )
  }

  async messageForNextOnCallEmails(emails: string[]) {
    const mentions = await this.convertEmailsToSlackMentions(emails)

    return `${mentions.join(
      ", "
    )} looks like you have on-call shifts coming up! Check out the <${
      StandupReminder.urls.engineeringSupport
    }|Engineering Support doc> to prep. You've got this! :+1:`
  }

  async convertEmailsToSlackMentions(emails: string[]) {
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
}
