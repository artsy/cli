import fetch from "node-fetch"
import { Config } from "../config"

export class Gravity {
  static BASE_URL_PRODUCTION = `https://api.artsy.net/`
  static BASE_URL_STAGING = `https://stagingapi.artsy.net/`

  static REDIRECT_PORT = 27879

  static baseUrl(isStaging = false) {
    return isStaging ? Gravity.BASE_URL_STAGING : Gravity.BASE_URL_PRODUCTION
  }

  static url(endpoint: string, isStaging = false) {
    return `${Gravity.baseUrl(isStaging)}${endpoint}`
  }

  static urls(isStaging = false) {
    return {
      current_user: Gravity.url("api/current_user", isStaging),
      auth: Gravity.url("oauth2/authorize", isStaging),
      access_token: Gravity.url("oauth2/access_token", isStaging),
      access_tokens: Gravity.url("api/tokens/access_token", isStaging),
      user_details: Gravity.url("api/current_user", isStaging),
      // tslint:disable-next-line:no-http-string
      callback: `http://127.0.0.1:${Gravity.REDIRECT_PORT}`,
    }
  }

  static authUrl(isStaging = false) {
    const urls = Gravity.urls(isStaging)
    const params = new URLSearchParams()

    params.append("client_id", Config.gravityId())
    params.append("redirect_uri", urls.callback)
    params.append("response_type", "code")

    const url = `${urls.auth}?${params.toString()}`
    return url
  }

  static async getAccessToken(code: string, isStaging = false) {
    const urls = Gravity.urls(isStaging)
    const params = new URLSearchParams()
    params.append("code", code.toString())
    params.append("client_id", Config.gravityId())
    params.append("client_secret", Config.gravitySecret())
    params.append("grant_type", "authorization_code")
    params.append("scope", "offline_access")

    const response = await fetch(urls.access_token, {
      method: "POST",
      body: params,
    })

    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`)

    const data = await response.json()
    return data
  }

  async get(endpoint: string, isStaging = false) {
    const token: string = Config.gravityToken(isStaging)

    const gravityUrl: string = Gravity.url(`api/v1/${endpoint}`, isStaging)
    const headers = { "X-Access-Token": token }
    const response = await fetch(gravityUrl, { headers })

    return response
  }
}
