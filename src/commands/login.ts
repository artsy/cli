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
          const params = new URLSearchParams()
          params.append("code", query.code.toString())
          params.append("client_id", process.env.CLIENT_ID as string)
          params.append("client_secret", process.env.CLIENT_SECRET as string)
          params.append("grant_type", "authorization_code")
          params.append("scope", "offline_access")

          const response = await fetch(Gravity.urls.access_token, {
            method: "POST",
            body: params,
          })

          if (!response.ok)
            this.error(`${response.status} ${response.statusText}`)

          const data = await response.json()
          Config.writeToken(data.access_token)

          cli.action.stop("logged in!")
        }
      })
      .listen(Gravity.REDIRECT_PORT)
    await cli.open(
      `${Gravity.urls.auth}?client_id=${process.env.CLIENT_ID}&redirect_uri=http://127.0.0.1:${Gravity.REDIRECT_PORT}&response_type=code`
    )
  }
}
