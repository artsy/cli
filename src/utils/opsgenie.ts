import fetch from "node-fetch"
import * as querystring from "querystring"

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

  scheduleOnCalls(
    scheduleName: string,
    targetDate = new Date()
  ): Promise<OpsGenieOnCallsResponse> {
    const qs = querystring.stringify({
      date: targetDate.toISOString(),
      scheduleIdentifierType: "name",
    })

    return this.get(
      `https://api.opsgenie.com/v2/schedules/${scheduleName}/on-calls?${qs}`
    )
  }

  scheduleNextOnCalls(
    scheduleName: string,
    targetDate = new Date()
  ): Promise<OpsGenieNextOnCallsResponse> {
    const qs = querystring.stringify({
      date: targetDate.toISOString(),
      scheduleIdentifierType: "name",
    })

    return this.get(
      `https://api.opsgenie.com/v2/schedules/${scheduleName}/next-on-calls?${qs}`
    )
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
