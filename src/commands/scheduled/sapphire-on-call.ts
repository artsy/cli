import Command from "../../base"

import { Opsgenie } from "../../utils/opsgenie"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class SapphireOnCall extends Command {
  static description =
    "Remind Sapphire members that are due to run upcoming ceremonies."

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
            text: `${mentions.join(
              ", "
            )} you're scheduled to run the Sapphire ceremonies, excluding retro, for the upcoming week!`,
          },
        },
      ],
    })

    this.log(payload)
  }

  async onCallEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleOnCalls(
      "Sapphire Weekly Ceremonies Rotation Excluding Retro"
    )

    return onCalls.data.onCallParticipants.map((participant: any) => {
      return participant.name
    })
  }
}
