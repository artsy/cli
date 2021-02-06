import fetch from "node-fetch"

export class Opsgenie {
  apiKey: string

  constructor() {
    if (!process.env.OPSGENIE_API_KEY) {
      throw new Error("OPSGENIE_API_KEY env var required")
    }

    this.apiKey = process.env.OPSGENIE_API_KEY
  }

  team(teamName: string): Promise<OpsGenieTeamResponse> {
    return this.get(
      `https://api.opsgenie.com/v2/teams/${teamName}?identifierType=name`
    )
  }

  user(username: string): Promise<OpsGenieUserResponse> {
    return this.get(`https://api.opsgenie.com/v2/users/${username}`)
  }

  users(): Promise<OpsGenieUsersResponse> {
    return this.get("https://api.opsgenie.com/v2/users")
  }

  async get(url: string) {
    const req = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `GenieKey ${this.apiKey}`,
      },
    })

    return req.json()
  }
}
