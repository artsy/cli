import fetch from "node-fetch"

class Gravity {
  static HOSTS = {
    staging: "stagingapi.artsy.net",
    production: "api.artsy.net",
  }

  async getAccessToken(credentials: Credentials) {
    const gravityUrl = this.url("oauth2/access_token")
    const body: AccessTokenRequest = {
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

    return json as AccessTokenResponse
  }

  async get(endpoint: string) {
    const token: string = process.env.TOKEN! // temp until our auth/token plumbing is hooked up

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

export interface Credentials {
  email: string
  password: string
}

interface AccessTokenRequest extends Credentials {
  grant_type: string
  client_id: string
  client_secret: string
}

interface AccessTokenResponse {
  access_token: string
  expires_in: string
}
