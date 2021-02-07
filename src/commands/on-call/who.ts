import { Command, flags } from "@oclif/command"
import { Opsgenie } from "../../utils/opsgenie"

export default class Who extends Command {
  static description = "List who is on call now"

  static flags = {
    date: flags.string({ description: "target date in ISO format" }),
    schedule: flags.string({
      description: "schedule name",
      default: "Engineering On Call",
    }),
  }

  async run() {
    require("dotenv").config()

    const participants = await this.fetchParticipants()

    participants.forEach(participant => this.log(participant.data.fullName))
  }

  async fetchParticipants() {
    const { flags } = this.parse(Who)

    const targetDate = flags.date ? new Date(flags.date) : new Date()

    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleOnCalls(flags.schedule, targetDate)

    if (!onCalls.data) {
      this.error(`Whoops! I didn't find the schedule \`${flags.schedule}\`.`)
    }

    const usernames = onCalls.data.onCallParticipants.map(
      (participant: any) => {
        return participant.name
      }
    )

    return Promise.all(usernames.map(username => opsgenie.user(username)))
  }
}
