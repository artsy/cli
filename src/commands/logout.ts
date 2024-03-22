import { Command, flags } from "@oclif/command"
import fetch from "node-fetch"
import { Gravity } from "../clients/gravity"
import { Config } from "../config"

export default class Logout extends Command {
  static description = "Expire your local auth token."

  static flags = {
    ...Command.flags,
    staging: flags.boolean({ char: "s" }),
  }

  async run() {
    const { flags } = this.parse(Logout);
    const isStaging = flags.staging

    const token = Config.gravityToken()

    if (!token) {
      this.log("Already logged out!")
      this.exit()
    }

    const params = new URLSearchParams()
    params.append("access_token", token)

    const response = await fetch(Gravity.urls(isStaging).access_tokens, {
      method: "DELETE",
      body: params,
    })

    if (!response.ok) this.error(`${response.status} ${response.statusText}`)

    if (isStaging) {
      Config.updateConfig({ stagingAccessToken: "" })
    } else {
      Config.updateConfig({ accessToken: "" })
    }
    this.log("Logged out!")
  }
}
