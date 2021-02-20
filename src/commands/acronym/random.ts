import Command from "../../base"
import { randomAcronym } from "../../lib/acronyms"

export default class Random extends Command {
  static description = "Return a random acronym heard at Artsy"

  static examples = [
    `$ artsy acronym:random
TAT: Turn around time`,
  ]

  static flags = {
    ...Command.flags,
  }

  async run() {
    const result = randomAcronym()

    this.log(result)
  }
}
