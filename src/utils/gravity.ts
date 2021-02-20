import fetch from "node-fetch"
import { Config } from "../config"

class Gravity {
  static BASE_URL = `https://api.artsy.net/`
  static REDIRECT_PORT = 27879

  static url(endpoint: string) {
    return `${Gravity.BASE_URL}${endpoint}`
  }

  static urls = {
    current_user: Gravity.url("api/current_user"),
    auth: Gravity.url("oauth2/authorize"),
    access_token: Gravity.url("oauth2/access_token"),
    access_tokens: Gravity.url("api/tokens/access_token"),
    user_details: Gravity.url("api/current_user"),
    // tslint:disable-next-line:no-http-string
    callback: `http://127.0.0.1:${Gravity.REDIRECT_PORT}`,
  }

  async getAccessToken(credentials: Credentials) {
    const gravityUrl = Gravity.urls.access_token
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
    const token: string = Config.readToken()

    const gravityUrl: string = Gravity.url(`api/v1/${endpoint}`)
    const headers = { "X-Access-Token": token }
    const response = await fetch(gravityUrl, { headers })

    return response
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
