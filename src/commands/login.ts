import cli from "cli-ux"
import Command from "../base"
import { Config } from "../config"
import Gravity from "../utils/gravity"

export default class Login extends Command {
  static description =
    "Log into the Artsy API. This is a prerequisite for many other commands."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const email = await cli.prompt("Email", { type: "normal" })
    const password = await cli.prompt("Password", { type: "hide" })

    this.log(`Authenticating against stagingapi.artsy.net for ${email}...`)

    const result = await new Gravity().getAccessToken({
      email,
      password,
    })

    Config.writeToken(result.access_token)
    this.log(result.access_token)
  }
}
