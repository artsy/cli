import Command from "../../base"

import { Config } from "../../config"
import { Opsgenie } from "../../utils/opsgenie"
import { Orbit } from "../../utils/orbit"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class SapphireOnCallRetro extends Command {
  static urls: { [key: string]: string } = {
    sapphireRetroInformation:
      "https://www.notion.so/artsy/Retros-0b23b316be19470386ae0f550a57ab36",
  }
  static description = "Remind Sapphire members that are due to run retro."

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
            )} you're scheduled to run Sapphire retro today! Check out the <${
              SapphireOnCallRetro.urls.sapphireRetroInformation
            }|Retro info doc> to prepare.`,
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
    const rotationId = Config.orbitSapphireRetroRotationId()
    if (!rotationId) return null

    const orbit = new Orbit()
    return orbit.onCallEmails(rotationId)
  }

  async onCallEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleOnCalls("Sapphire Retro Rotation")

    return onCalls.data.onCallParticipants.map((participant: any) => {
      return participant.name
    })
  }
}
