import { flags } from "@oclif/command"
import Command from "../../base"
import { Opsgenie } from "../../utils/opsgenie"
import { convertEmailsToSlackMentions } from "../../utils/slack"

interface Dates {
  baseDate: string
  exceptions: string[]
}

const useDatesVarDescription = `
Use dates from DATES env var.
Dates env var is a JSON string with the following format: { baseDate: string, exceptions: string[] }
Each date should be in the following format: YYYY-MM-DD
Example: { "baseDate": "2023-04-27", "exceptions": ["2023-05-03", "2023-05-31"] }
`.trim()

export default class FacilitateIncidentReview extends Command {
  static description =
    "Choose a random on-call participant to facilitate the Incident Review"
  static urls: { [key: string]: string } = {
    incidentReviewSchedule:
      "https://www.notion.so/artsy/Incident-Reviews-725052225efc49e78532b13e166ba3c7",
    onCallEngineeringSchedule:
      "https://artsy.app.opsgenie.com/teams/dashboard/ee381004-a72e-42ef-a733-b350d6693c6c/main",
  }

  static flags = {
    ...Command.flags,
    date: flags.string({
      description: "target date in ISO format",
      default: wednesdayShift(),
    }),
    schedule: flags.string({
      description: "schedule name",
      default: "Engineering On Call",
    }),
    facilitatorEmail: flags.string({
      description: "facilitator email",
    }),
    useDatesVar: flags.boolean({
      description: useDatesVarDescription,
      default: false,
    }),
  }

  async run() {
    const { flags } = this.parse(FacilitateIncidentReview)

    if (flags.useDatesVar) {
      if (!process.env.DATES) {
        this.error("DATES env var is not set. Use --help for more info.")
      } else {
        let dates: Dates = { baseDate: "", exceptions: [] }
        try {
          dates = JSON.parse(process.env.DATES)
        } catch (error) {
          this.error(`${error}. Use --help for more info.`)
        }

        if (isOffWeek(dates)) {
          this.log("Off week")
          return
        }
      }
    }

    let email = flags.facilitatorEmail || ""
    let emails = [] as string[]

    if (!email) {
      emails = await onCallParticipantEmails(flags.schedule, flags.date)

      // at random select an email (participant) to facilitate the incident review
      email = emails[Math.floor(Math.random() * emails.length)]
    }

    const mention = (await convertEmailsToSlackMentions([email])).pop()

    const payload = JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${mention} :wave:, based on the <${FacilitateIncidentReview.urls.onCallEngineeringSchedule}|on-call schedule> you have been selected to _prepare for and facilitate_ the Incident Review meeting tomorrow at 11AM ET! :tada:
Check out the <${FacilitateIncidentReview.urls.incidentReviewSchedule}|Incident Review Schedule> for more information and the next steps.`,
          },
        },
      ],
    })

    this.log(payload)
  }
}

async function onCallParticipantEmails(
  schedule: string,
  date: string
): Promise<string[]> {
  const opsgenie = new Opsgenie()
  const targetDate = date ? new Date(date) : new Date()
  const onCalls = await opsgenie.scheduleOnCalls(schedule, targetDate)

  if (!onCalls.data) {
    Command.prototype.error(`Whoops! '${schedule}' is not a valid schedule.`)
  }

  return onCalls.data.onCallParticipants.map(
    (participant: OpsGenieOnCallParticipant) => {
      return participant.name
    }
  )
}

// By default we want to select on-call participants after Wednesday at 11AM ET
// because that is when the on-call schedule is updated.
// Setting the default to Wednesday at 2PM ET to avoid issues when daylight savings time shifts.
function wednesdayShift() {
  const wednesday = new Date() // this returns the current date and time in UTC
  wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3) // 3 = Wednesday
  wednesday.setHours(18, 0, 0, 0) // 18 in UTC = 2PM ET (when daylight savings time is in effect)
  return wednesday.toISOString()
}

// Determine if the current week is an 'off week' for Incident Reviews
// baseDate: is the starting date used to calculate if the current week is an 'off week'
//   **Incident Reviews are held every other week
// exceptions: is an array of dates for which the baseDate based calculation will be ignored
function isOffWeek(dates: Dates) {
  if (!dates.baseDate || !dates.exceptions) {
    throw new Error("dates object is not valid")
  } else if (!Array.isArray(dates.exceptions)) {
    throw new Error("exceptions is not an array")
  } else if (!Date.parse(dates.baseDate)) {
    throw new Error("baseDate is not a valid date")
  }

  dates.exceptions.forEach(date => {
    if (!Date.parse(date)) {
      throw new Error("exceptions contains a date that is not valid")
    }
  })

  const today = new Date().toISOString()

  // calculate the number of weeks since the baseDate
  // if val is less than 1.5, it is an 'off week'
  const val =
    ((Date.parse(today) - Date.parse(dates.baseDate)) /
      (1000 * 60 * 60 * 24 * 7)) %
    2

  // if the today is not in the exceptions array and val is less than 1.5 its an 'off week', return true
  if (!dates.exceptions.includes(today.split("T")[0]) && val < 1.5) {
    return true
  }

  return false
}
