import { flags } from "@oclif/command"
import { Opsgenie } from "../../utils/opsgenie"

import Command from "../../base"

export default class Next extends Command {
  static description = "List is on call next"

  static flags = {
    ...Command.flags,
    date: flags.string({ description: "target date in ISO format" }),
    schedule: flags.string({
      description: "schedule name",
      default: "Engineering On Call",
    }),
  }

  async run() {
    const participants = await this.fetchParticipants()

    participants.forEach(participant => this.log(participant.data.fullName))
  }

  async fetchParticipants() {
    const { flags } = this.parse(Next)

    const targetDate = flags.date ? new Date(flags.date) : new Date()

    const opsgenie = new Opsgenie()
    const onCalls = await opsgenie.scheduleNextOnCalls(
      flags.schedule,
      targetDate
    )

    if (!onCalls.data) {
      this.error(`Whoops! I didn't find the schedule \`${flags.schedule}\`.`)
    }

    const usernames = onCalls.data.exactNextOnCallRecipients.map(
      participant => {
        return participant.name
      }
    )

    return Promise.all(usernames.map(username => opsgenie.user(username)))
  }
}
