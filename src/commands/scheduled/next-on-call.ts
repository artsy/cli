import Command from "../../base"

import { Opsgenie } from "../../utils/opsgenie"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class NextOnCall extends Command {
  static urls: { [key: string]: string } = {
    engineeringSupport:
      "https://github.com/artsy/README/tree/main/playbooks/support#preparing-for-your-on-call-shift",
  }

  static description = "Remind members with upcoming on-call shifts."

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
            )} looks like you have on-call shifts coming up! Check out the <${
              NextOnCall.urls.engineeringSupport
            }|Engineering Support doc> to prep. You've got this! :+1:`,
          },
        },
      ],
    })

    this.log(payload)
  }

  async nextOnCallEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleNextOnCalls("Engineering On Call")

    return onCalls.data.exactNextOnCallRecipients.map((participant: any) => {
      return participant.name
    })
  }
}
