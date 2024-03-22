
import Command from "../base"
import { Config } from "../config"
import * as fs from 'fs/promises'

export default class Inspect extends Command {
  static description = "Returns inspection data for a given query"

  static examples = [
    `$ artsy inspect your_query.graphql
      TODO: Put an example here
    `,
  ]

  static flags = {
    ...Command.flags,
  }

  static args = [
    { name: "query-file", required: true },
    { name: "variables-file", required: true }
  ]


  async run() {
    if (!Config.gravityToken())
      this.error("You are not logged in. Run `artsy login`.")

    const { args } = this.parse(Inspect)

    try {
      const query = await fs.readFile(args['query-file'], 'utf8');
      let variables = {};

      // If a variables file was provided, read and parse it
      if (args['variables-file']) {
        const variablesContent = await fs.readFile(args['variables-file'], 'utf8');
        variables = JSON.parse(variablesContent); // Parse the JSON variables
      }

      this.log(`Query:\n${query}`);
      this.log(`Variables:\n${JSON.stringify(variables, null, 2)}`);

    } catch (error: any) {
      this.error(`Error reading file: ${error.message}`);
    }
  }
}
