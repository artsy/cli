import { Command } from "@oclif/command"
import fetch from "node-fetch"
import { Config } from "../config"
import Gravity from "../utils/gravity"

export default class Logout extends Command {
  static description = "Expire your local auth token."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const token = Config.readToken()

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

    Config.writeToken("")
    this.log("Logged out!")
  }
}
