import { Command } from "@oclif/command"
import fetch from "node-fetch"
import { Gravity } from "../clients/gravity"
import { Config } from "../config"

export default class Logout extends Command {
  static description = "Expire your local auth token."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const token = Config.gravityToken()

    if (!token) {
      this.log("Already logged out!")
      this.exit()
    }

    const params = new URLSearchParams()
    params.append("access_token", token)
    const response = await fetch(Gravity.urls.access_tokens, {
      method: "DELETE",
      body: params,
    })

    if (!response.ok) this.error(`${response.status} ${response.statusText}`)

    Config.updateConfig({ accessToken: "" })
    this.log("Logged out!")
  }
}
