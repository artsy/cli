import Command from "../../base"

import { Opsgenie } from "../../utils/opsgenie"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class NextOnCall extends Command {
  static description =
    "Remind Sapphire members that are due to run upcoming ceremonies."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const emails = await this.nextOnCallEmailsFromOpsGenie()
    const mentions = await convertEmailsToSlackMentions(emails)

    const payload = JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${mentions.join(
              ", "
            )} you're scheduled to run the Sapphire ceremonies, excluding retro, for the upcoming week!`,
          },
        },
      ],
    })

    this.log(payload)
  }

  async nextOnCallEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleNextOnCalls(
      "Sapphire Weekly Ceremonies Rotation Excluding Retro"
    )

    return onCalls.data.exactNextOnCallRecipients.map((participant: any) => {
      return participant.name
    })
  }
}
