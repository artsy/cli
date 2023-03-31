import { flags } from "@oclif/command"
import Command from "../../base"
import { fetchParticipants } from "../../utils/fetch-participants"
import { convertEmailsToSlackMentions } from "../../utils/slack"

export default class FacilitateIncidentReview extends Command {
  static description =
    "Choose a random on-call participant to facilitate the Incident Review"
  static urls: { [key: string]: string } = {
    incidentReviewSchedule:
      "https://www.notion.so/artsy/Incident-Reviews-725052225efc49e78532b13e166ba3c7",
    oncallEngineeringSchedule:
      "https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c/main",
  }

  static flags = {
    ...Command.flags,
    date: flags.string({
      description: "target date in ISO format",
      default: wednesday11AM(),
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
    const email =
      participants[Math.floor(Math.random() * participants.length)].data
        .username
    const mention = (await convertEmailsToSlackMentions([email])).pop()

    const payload = JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${mention} :wave:, based on the <${FacilitateIncidentReview.urls.oncallEngineeringSchedule}|on-call schedule> you have been selected to _prepare for and facilitate_ the Incident Review meeting tomorrow at 11AM ET! :tada:
Check out the <${FacilitateIncidentReview.urls.incidentReviewSchedule}|Incident Review Schedule> for more information and the next steps.`,
          },
        },
      ],
    })

    this.log(payload)
  }
}

function wednesday11AM() {
  const wednesday = new Date()
  wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3)
  wednesday.setHours(11, 0, 0, 0)
  return wednesday.toISOString()
}
