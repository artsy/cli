import Command, { flags } from "@oclif/command"

export default abstract class extends Command {
  static flags = {
    help: flags.help({ char: "h" }),
  }

  async init() {
    require("dotenv").config()
  }
}
