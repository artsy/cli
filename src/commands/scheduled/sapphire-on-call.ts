import Command from "../../base"

import { Config } from "../../config"
import { Opsgenie } from "../../utils/opsgenie"
import { Orbit } from "../../utils/orbit"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class SapphireOnCall extends Command {
  static description =
    "Remind Sapphire members that are due to run upcoming ceremonies."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const emails = await this.onCallEmails()
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

  // Prefers Orbit when a rotation id is configured (see ../../utils/orbit);
  // otherwise (and if the Orbit lookup fails) falls back to the Opsgenie
  // schedule, unchanged from before.
  async onCallEmails() {
    const orbitEmails = await this.onCallEmailsFromOrbit()
    if (orbitEmails) return orbitEmails

    return this.onCallEmailsFromOpsGenie()
  }

  async onCallEmailsFromOrbit() {
    const rotationId = Config.orbitSapphireRotationId()
    if (!rotationId) return null

    const orbit = new Orbit()
    return orbit.onCallEmails(rotationId)
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
