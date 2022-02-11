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

  static authUrl() {
    const params = new URLSearchParams()

    params.append("client_id", Config.gravityId())
    params.append("redirect_uri", Gravity.urls.callback)
    params.append("response_type", "code")

    const url = `${Gravity.urls.auth}?${params.toString()}`
    return url
  }

  static async getAccessToken(code: string) {
    const params = new URLSearchParams()
    params.append("code", code.toString())
    params.append("client_id", Config.gravityId())
    params.append("client_secret", Config.gravitySecret())
    params.append("grant_type", "authorization_code")
    params.append("scope", "offline_access")

    const response = await fetch(Gravity.urls.access_token, {
      method: "POST",
      body: params,
    })

    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`)

    const data = await response.json()

    return data
  }

  async get(endpoint: string) {
    const token: string = Config.gravityToken()

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
