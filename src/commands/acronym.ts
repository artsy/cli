import { Command, flags } from "@oclif/command"
import { findAcronym } from "../lib/acronyms"

export default class Acronym extends Command {
  static aliases = ["tla", "wtf"]

  static description = "Explain an acronym heard at Artsy"

  static examples = [
    `$ artsy acronym aov
AOV: Average Order Value`,
  ]

  static flags = {
    help: flags.help({ char: "h" }),
  }

  static args = [{ name: "query" }]

  async run() {
    const { args } = this.parse(Acronym)
    const result = findAcronym(args.query)

    if (result) {
      console.log(result)
    } else {
      console.log("Sorry, unknown acronym")
    }
  }
}
