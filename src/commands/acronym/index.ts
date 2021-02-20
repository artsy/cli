import Command from "../../base"
import { findAcronym } from "../../lib/acronyms"

export default class Acronym extends Command {
  static aliases = ["tla", "wtf"]

  static description = "Explain an acronym heard at Artsy"

  static examples = [
    `$ artsy acronym aov
AOV: Average Order Value`,
  ]

  static flags = {
    ...Command.flags,
  }

  static args = [{ name: "acronym", required: true }]

  async run() {
    const { args } = this.parse(Acronym)
    const result = findAcronym(args.acronym)

    if (result) {
      this.log(result)
    } else {
      this.log("Sorry, unknown acronym")
    }
  }
}
