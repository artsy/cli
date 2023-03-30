import { flags } from "@oclif/command"
import Command from "../../base"
import { convertEmailsToSlackMentions } from "../../utils/slack"
import { fetchParticipants } from "../../utils/fetchParticipants"

export default class FacilitateIncidentReview extends Command {
  static description = "Choose a random on-call participant to facilitate the Incident Review"
  static playbook = "https://www.notion.so/artsy/Incident-Review-Facilitation-Template-on-call-edition-195fbb6853ff423197a2ed9dd72fee45"

  static flags = {
    ...Command.flags,
    date: flags.string({
      description: "target date in ISO format",
      default: wednesday11AM()
    }),
    schedule: flags.string({
      description: "schedule name",
      default: "Engineering On Call",
    }),
  }

  async run() {
    const { flags } = this.parse(FacilitateIncidentReview)
    const participants = await fetchParticipants(flags)

    // at random select a participant and return their email (username)
    const email = (participants[Math.floor(Math.random() * participants.length)]).data.username
    const mention = (await convertEmailsToSlackMentions([email])).pop()

    const payload = JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${mention} you have been selected to facilitate the upcoming Incident Review meeting! :tada:
Check out the <${FacilitateIncidentReview.playbook}|Incident Review Playbook> for more information and the next steps.`,
          }
        }
      ]
    })

    this.log(payload)
  }
}

function wednesday11AM () {
  const wednesday = new Date()
  wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3)
  wednesday.setHours(11, 0, 0, 0)
  return wednesday.toISOString()
}
