import fetch from "node-fetch"
import { Config } from "../config"

/**
 * Client for Orbit (github.com/artsy/orbit), Artsy's on-call rotation
 * scheduler, used as an opt-in alternative to an Opsgenie schedule.
 *
 * Orbit models a rotation as a single ordered on-call owner (with overrides
 * and shift-swaps layered on top), so `onCallEmails` always resolves to at
 * most one email — unlike Opsgenie's `onCallParticipants`, which can list
 * several. Callers already treat that as a list of Slack mentions, so a
 * single-element array is a drop-in replacement.
 */
export class Orbit {
  url: string
  token: string

  constructor() {
    this.url = Config.orbitUrl()
    this.token = Config.orbitToken()
  }

  get isConfigured(): boolean {
    return Boolean(this.url && this.token)
  }

  /**
   * The email of whoever is currently on call for `rotationId`, or `null`
   * when Orbit isn't configured, the rotation has no one on call right now,
   * or the request fails — callers should fall back to Opsgenie in all of
   * those cases.
   */
  async onCallEmails(rotationId: string): Promise<string[] | null> {
    if (!this.isConfigured) return null

    try {
      const res = await fetch(
        `${this.url}/api/rotations/${rotationId}/on-call`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      )
      if (!res.ok) {
        throw new Error(`Orbit request failed (${res.status})`)
      }

      const body = await res.json()
      const email = body?.current?.engineer?.email
      return email ? [email] : []
    } catch (error) {
      console.error("Orbit lookup failed; falling back to Opsgenie.", error)
      return null
    }
  }
}
