import { Command, flags } from "@oclif/command"

export default class Login extends Command {
  static description =
    "Log into the Artsy API. This is a prerequisite for many other commands."

  static flags = {
    help: flags.help({ char: "h" }),
  }

  // static args = [{ name: 'file' }];

  async run() {
    // const {args, flags} = this.parse(Auth)
    this.log("Authenticating against stagingapi.artsy.net...")
  }
}
