import Command from "../../base"

import { Config } from "../../config"
import { Opsgenie } from "../../utils/opsgenie"
import { Orbit } from "../../utils/orbit"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class SecurityBountyRotation extends Command {
  static urls: { [key: string]: string } = {
    playbook:
      "https://www.notion.so/artsy/Security-Bounty-Program-Playbook-0071e3292a194f23b6a8ae593a08d3f3",
  }
  static description =
    "Remind members that are due to respond to security bounty submissions."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const emails = await this.rotationEmails()
    const mentions = await convertEmailsToSlackMentions(emails)

    const payload = JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${mentions.join(
              ", "
            )} you're scheduled to respond to bounty submissions in the upcoming week! Check out <${
              SecurityBountyRotation.urls.playbook
            }|the playbook> to prepare.`,
          },
        },
      ],
    })

    this.log(payload)
  }

  // Prefers Orbit when a rotation id is configured (see ../../utils/orbit);
  // otherwise (and if the Orbit lookup fails) falls back to the Opsgenie
  // schedule, unchanged from before.
  async rotationEmails() {
    const orbitEmails = await this.rotationEmailsFromOrbit()
    if (orbitEmails) return orbitEmails

    return this.rotationEmailsFromOpsGenie()
  }

  async rotationEmailsFromOrbit() {
    const rotationId = Config.orbitSecurityBountyRotationId()
    if (!rotationId) return null

    const orbit = new Orbit()
    return orbit.onCallEmails(rotationId)
  }

  async rotationEmailsFromOpsGenie() {
    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleOnCalls(
      "Security Bounty Responders Schedule"
    )

    return onCalls.data.onCallParticipants.map((participant: any) => {
      return participant.name
    })
  }
}
