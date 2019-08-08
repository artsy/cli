import { Command, flags } from "@oclif/command"
import cli from "cli-ux"

export default class Login extends Command {
  static description =
    "Log into the Artsy API. This is a prerequisite for many other commands."

  static flags = {
    help: flags.help({ char: "h" }),
  }

  // static args = [{ name: 'file' }];

  async run() {
    // const {args, flags} = this.parse(Auth)
    const username = await cli.prompt("Username", { type: "normal" })
    const password = await cli.prompt("Password", { type: "hide" })

    this.log(
      `Authenticating against stagingapi.artsy.net with ${username}|${password}`
    )
  }
}
