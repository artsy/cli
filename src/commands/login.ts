import cli from "cli-ux"
import fetch from "node-fetch"
import { parse } from "querystring"
import Command from "../base"
import { Config } from "../config"
import Gravity from "../utils/gravity"

export default class Login extends Command {
  static description =
    "Log into the Artsy API. This is a prerequisite for many other commands."

  static flags = {
    ...Command.flags,
  }

  async run() {
    await cli.anykey("Ready! Press any key to initiate authorization flow")

    cli.action.start("Waiting for response")

    const server = require("http")
      .createServer(async (req: any, res: any) => {
        const url = new URL(req.url, Gravity.urls.callback)
        const query = parse(url.search.substr(1))

        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("Thank you. You may return to the Artsy CLI now.")

        req.connection.end()
        req.connection.destroy()
        server.close()

        if (query.code) {
          try {
            const data = await Gravity.getAccessToken(query.code.toString())
            Config.writeToken(data.access_token)
            cli.action.stop("logged in!")
          } catch (error) {
            this.error(error)
          }
        }
      })
      .listen(Gravity.REDIRECT_PORT)
    await cli.open(
      `${Gravity.urls.auth}?client_id=${process.env.CLIENT_ID}&redirect_uri=http://127.0.0.1:${Gravity.REDIRECT_PORT}&response_type=code`
    )
  }
}
