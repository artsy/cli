import Command from "@oclif/command"
import { Opsgenie } from "./opsgenie"

export async function fetchParticipants(flags: any) : Promise<OpsGenieUserResponse[]> {

  const targetDate = flags.date ? new Date(flags.date) : new Date()

  const opsgenie = new Opsgenie()
  const onCalls = await opsgenie.scheduleOnCalls(flags.schedule, targetDate)

  if (!onCalls.data) {
    Command.prototype.error(`Whoops! I didn't find the schedule \`${flags.schedule}\`.`)
  }

  const usernames = onCalls.data.onCallParticipants.map(participant => {
    return participant.name
  })

  return Promise.all(usernames.map(username => opsgenie.user(username)))
}
