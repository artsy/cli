import { Command } from "@oclif/command"
import fetch from "node-fetch"
import { Gravity } from "../clients/gravity"
import { Config } from "../config"

export default class Logout extends Command {
  static description = "Expire your local auth tokens."

  static flags = {
    ...Command.flags,
  }

  async run() {
    const prodToken = Config.gravityToken(false)
    const stagingToken = Config.gravityToken(true)

    if (!prodToken && !stagingToken) {
      this.log("Already logged out from both environments!")
      return
    }

    await this.performLogout(prodToken, false)
    await this.performLogout(stagingToken, true)

    this.log("Logged out from all environments!")
  }

  async performLogout(token: string, isStaging: boolean) {
    if (!token) return

    const params = new URLSearchParams()
    params.append("access_token", token)

    const response = await fetch(Gravity.urls(isStaging).access_tokens, {
      method: "DELETE",
      body: params,
    })

    if (!response.ok) {
      this.error(
        `Failed to log out from ${
          isStaging ? "staging" : "production"
        } environment: ${response.status} ${response.statusText}`
      )
    }

    const tokenKey = isStaging ? "stagingAccessToken" : "accessToken"
    Config.updateConfig({ [tokenKey]: "" })
  }
}
