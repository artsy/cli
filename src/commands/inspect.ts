
import Command from "../base"
import { Config } from "../config"

export default class Inspect extends Command {
  static description = "Returns inspection data for a given query"

  static examples = [
    `$ artsy inspect
      TODO: Put an example here
    `,
  ]

  static flags = {
    ...Command.flags,
  }

  static args = [{ name: "query", required: true }]

  async run() {
    if (!Config.gravityToken())
      this.error("You are not logged in. Run `artsy login`.")

    const { args } = this.parse(Inspect)
 
    this.log(`hello there`)
  }
}
