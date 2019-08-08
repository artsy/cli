import fetch from "node-fetch"

class Gravity {
  static HOSTS = {
    staging: "stagingapi.artsy.net",
    production: "api.artsy.net",
  }

  async get(endpoint: string) {
    const token: string = process.env.TOKEN! // temp until our auth/token plumbing is hooked up

    const gravityUrl: string = this.url(endpoint)
    const headers = { "X-Access-Token": token }
    const response = await fetch(gravityUrl, { headers })

    return response
  }

  url(endpoint: string): string {
    const host = Gravity.HOSTS.staging
    return `https://${host}/api/v1/${endpoint}`
  }
}

export default Gravity
