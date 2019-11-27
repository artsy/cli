import fetch from "node-fetch"
import { Config } from "../../config"

class Gravity {
  static HOSTS = {
    staging: "stagingapi.artsy.net",
    production: "api.artsy.net",
  }

  async getAccessToken(
    credentials: GravityCredentials
  ): Promise<GravityAccessTokenResponse | GravityErrorResponse> {
    const gravityUrl = this.url("oauth2/access_token")
    const body: GravityAccessTokenRequest = {
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      grant_type: "credentials",
      ...credentials,
    }

    const response = await fetch(gravityUrl, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })

    const json = await response.json()

    return json
  }

  async get(endpoint: string) {
    const token: string = Config.readToken()

    const gravityUrl: string = this.url(`api/v1/${endpoint}`)
    const headers = { "X-Access-Token": token }
    const response = await fetch(gravityUrl, { headers })

    return response
  }

  url(endpoint: string): string {
    const host = Gravity.HOSTS.staging
    return `https://${host}/${endpoint}`
  }
}

export default Gravity
