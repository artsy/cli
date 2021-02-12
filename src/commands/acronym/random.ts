import { Command, flags } from "@oclif/command"
import { randomAcronym } from "../../lib/acronyms"

export default class Random extends Command {
  static description = "Return a random acronym heard at Artsy"

  static examples = [
    `$ artsy acronym:random
TAT: Turn around time`,
  ]

  static flags = {
    help: flags.help({ char: "h" }),
  }

  async run() {
    const result = randomAcronym()

    this.log(result)
  }
}
