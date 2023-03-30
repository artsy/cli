import { flags } from "@oclif/command"
import { Opsgenie } from "../../utils/opsgenie"
import Command from "../../base"
import { convertEmailsToSlackMentions } from "../../utils/slack"

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
    const participants = await this.fetchParticipants()

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

  async fetchParticipants() {
    const { flags } = this.parse(FacilitateIncidentReview)

    const targetDate = flags.date ? new Date(flags.date) : new Date()

    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleOnCalls(flags.schedule, targetDate)

    if (!onCalls.data) {
      this.error(`Whoops! I didn't find the schedule \`${flags.schedule}\`.`)
    }

    const usernames = onCalls.data.onCallParticipants.map(participant => {
      return participant.name
    })

    return Promise.all(usernames.map(username => opsgenie.user(username)))
  }
}

function wednesday11AM () {
  const wednesday = new Date()
  wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3)
  wednesday.setHours(11, 0, 0, 0)
  return wednesday.toISOString()
}
