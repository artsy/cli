import { Command } from "@oclif/command"
import { flags } from "@oclif/command"
import cli from "cli-ux"
import fetch from "node-fetch"
import { Gravity } from "../clients/gravity"
import { Config } from "../config"

export default class WhoAmI extends Command {
  static description = "Who are you?"

  static flags = {
    ...Command.flags,
    ...cli.table.flags(),
    staging: flags.boolean({ char: "s" }),
  }

  async run() {
    const { flags } = this.parse(WhoAmI)
    const isStaging = flags.staging

    const token = Config.gravityToken(isStaging)
    if (!token) this.error("You are not logged in. Run `artsy login`.")

    const userResponse = await fetch(Gravity.urls(isStaging).current_user, {
      headers: { "X-Access-Token": Config.gravityToken(isStaging) },
    })

    const json = await userResponse.json()

    const detailsResponse = await fetch(json._links.user_detail.href, {
      headers: { "X-Access-Token": token },
    })

    const detailsJson = await detailsResponse.json()
    cli.table(
      [detailsJson],
      {
        name: {},
        email: {},
        phone: {},
        type: {},
        timezone: {},
        timezone_code: {},
      },
      {
        printLine: this.log,
        ...flags,
      }
    )
  }
}
