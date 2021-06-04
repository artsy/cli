import Command from "../../base"

import { Opsgenie } from "../../utils/opsgenie"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class StandupReminder extends Command {
  static urls: { [key: string]: string } = {
    onCallSchedule:
      "https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c",
    standup: "https://github.com/artsy/README/blob/main/events/open-standup.md",
    notes:
      "https://www.notion.so/artsy/Standup-Notes-28a5dfe4864645788de1ef936f39687c",
  }

  static description =
    "Remind facilitators and participants of upcoming standup."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const emails = await this.onCallEmailsFromOpsGenie()
    const mentions = await convertEmailsToSlackMentions(emails)

    const payload = JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Hi ${mentions.join(" and ")} :wave:\n\nBased on our <${
              StandupReminder.urls.onCallSchedule
            }|on-call schedule>, you've been chosen to facilitate today's Engineering Standup at 12pm ET. Please refer to the docs <${
              StandupReminder.urls.standup
            }|on GitHub> and add new standup notes <${
              StandupReminder.urls.notes
            }|in Notion>.`,
          },
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
}
