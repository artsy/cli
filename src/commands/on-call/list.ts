import { Command, flags } from "@oclif/command"
import fetch from "node-fetch"

const chunk = require("lodash.chunk")
const shuffle = require("lodash.shuffle")

export default class List extends Command {
  static description = "List users via OpsGenie"

  static flags = {
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
    "team-name": flags.string({
      description: "Name of team to limit results to",
    }),
  }

  async run() {
    const { flags } = this.parse()

    require("dotenv").config()

    let usernames: string[]

    if (flags["team-name"]) {
      const teamMembers = await this.fetchTeamMembers(flags["team-name"])

      usernames = teamMembers.data.members.map((member: any) => {
        return member.user.username
      })
    } else {
      const users = await this.fetchUsers()

      usernames = users.data.map((user: any) => {
        return user.username
      })
    }

    let users = await Promise.all(
      usernames.map(username => this.fetchTeamMember(username))
    )

    if (flags.randomize) {
      users = shuffle(users)
    }

    chunk(users, Math.round(users.length / flags.split)).forEach(
      (group: any, index: number) => {
        group.forEach((user: any) => {
          this.log(user.data.fullName)
        })

        if (index + 1 < flags.split) {
          this.log()
        }
      }
    )
  }

  async fetchTeamMembers(teamName: string): Promise<any> {
    const url = `https://api.opsgenie.com/v2/teams/${teamName}?identifierType=name`

    return this.get(url)
  }

  async fetchUsers(): Promise<any> {
    const url = `https://api.opsgenie.com/v2/users`

    return this.get(url)
  }

  async fetchTeamMember(username: string): Promise<any> {
    const url = `https://api.opsgenie.com/v2/users/${username}`

    return this.get(url)
  }

  async get(url: string) {
    const req = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `GenieKey ${process.env.OPSGENIE_API_KEY}`,
      },
    })

    return req.json()
  }
}
