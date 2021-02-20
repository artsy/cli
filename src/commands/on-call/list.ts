import { flags } from "@oclif/command"
import Command from "../../base"
import { Opsgenie } from "../../utils/opsgenie"

const chunk = require("lodash.chunk")
const shuffle = require("lodash.shuffle")

export default class List extends Command {
  static description = "List users via OpsGenie"

  static flags = {
    ...Command.flags,
    randomize: flags.boolean({
      char: "r",
      default: false,
      description: "Trigger randomization",
    }),
    split: flags.integer({
      char: "s",
      default: 1,
      description: "Split members into [N] groups",
    }),
    team: flags.string({
      char: "t",
      description: "Name of team to limit results to",
    }),
  }

  async run() {
    const { flags } = this.parse(List)

    let users = await this.fetchUsers()

    if (flags.randomize) {
      users = shuffle(users)
    }

    this.output(users)
  }

  async fetchUsers() {
    const { flags } = this.parse(List)
    const opsgenie = new Opsgenie()
    let usernames: string[]

    if (flags.team) {
      const team = await opsgenie.team(flags.team)

      usernames = team.data.members.map((member: any) => {
        return member.user.username
      })
    } else {
      const users = await opsgenie.users()

      usernames = users.data.map((user: any) => {
        return user.username
      })
    }

    return Promise.all(usernames.map(username => opsgenie.user(username)))
  }

  group(users: any[]) {
    const { flags } = this.parse(List)

    return chunk(users, Math.round(users.length / flags.split))
  }

  output(users: any[]) {
    const { flags } = this.parse(List)

    this.group(users).forEach((group: any, index: number) => {
      // print each member's name
      group.forEach((user: any) => {
        this.log(user.data.fullName)
      })

      // print separator between groups
      if (index + 1 < flags.split) {
        this.log()
      }
    })
  }
}
