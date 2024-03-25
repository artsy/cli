import { flags } from "@oclif/command"
import cli from "cli-ux"
import { parse } from "querystring"
import Command from "../base"
import { Gravity } from "../clients/gravity"
import { Config } from "../config"

export default class Login extends Command {
  static description =
    "Log into the Artsy API. This is a prerequisite for many other commands."

  static flags = {
    ...Command.flags,
    staging: flags.boolean({ char: "s" }),
  }

  async run() {
    const { flags } = this.parse(Login)
    const isStaging = flags.staging

    await cli.anykey("Ready! Press any key to initiate authorization flow")

    cli.action.start("Waiting for response")

    const server = require("http").createServer()

    const requestHandler = async (req: any, res: any) => {
      const url = new URL(req.url, Gravity.urls().callback)
      const query = parse(url.search.substr(1))

      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("Thank you. You may return to the Artsy CLI now.")

      req.connection.end()
      req.connection.destroy()
      server.close()

      if (query.code) {
        try {
          const data = await Gravity.getAccessToken(
            query.code.toString(),
            isStaging
          )
          if (isStaging) {
            Config.updateConfig({ stagingAccessToken: data.access_token })
          } else {
            Config.updateConfig({ accessToken: data.access_token })
          }
          cli.action.stop("logged in!")
        } catch (error) {
          this.error(error)
        }
      }
    }

    server.on("request", requestHandler)
    server.listen(Gravity.REDIRECT_PORT)

    await cli.open(Gravity.authUrl(isStaging))
  }
}
