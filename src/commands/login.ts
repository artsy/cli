import { Command, flags } from "@oclif/command"
import cli from "cli-ux"
import { Config } from "../config"
import Gravity from "../lib/gravity"

export default class Login extends Command {
  static description =
    "Log into the Artsy API. This is a prerequisite for many other commands."

  static flags = {
    help: flags.help({ char: "h" }),
  }

  async run() {
    require("dotenv").config()

    const email = await cli.prompt("Email", { type: "normal" })
    const password = await cli.prompt("Password", { type: "hide" })

    this.log(`Authenticating against stagingapi.artsy.net for ${email}...`)

    const result = await new Gravity().getAccessToken({
      email,
      password,
    })

    const errorDescription = (result as GravityErrorResponse).error_description

    if (errorDescription) {
      this.error(errorDescription)
    }

    const accessToken = (result as GravityAccessTokenResponse).access_token

    Config.writeToken(accessToken)
    this.log(accessToken)
  }
}
