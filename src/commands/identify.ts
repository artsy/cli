import { Command, flags } from "@oclif/command"
import Gravity from "../lib/gravity"

export default class Identify extends Command {
  static description = "Identify a Gravity resource by its BSON ID"

  static flags = {
    help: flags.help({ char: "h" }),
  }

  static args = [{ name: "id" }]

  static collectionsToCheck = [
    { name: "Artist", endpoint: "artist" },
    { name: "Artwork", endpoint: "artwork" },
    { name: "Partner", endpoint: "partner" },
  ]

  async run() {
    const gravity = new Gravity()
    const { args } = this.parse(Identify)
    const { id } = args

    const gravityPromises = Identify.collectionsToCheck.map(collection => {
      const resource = `${collection.endpoint}/${id}`
      return gravity.get(resource)
    })

    const gravityResponses = await Promise.all(gravityPromises)
    const foundIndex = gravityResponses.findIndex(r => r.status === 200)

    if (foundIndex >= 0) {
      const foundCollection = Identify.collectionsToCheck[foundIndex]
      const foundResource = `${foundCollection.endpoint}/${id}`
      this.log(`${foundCollection.name} ${gravity.url(foundResource)}`)
    } else {
      const collections = Identify.collectionsToCheck.map(c => c.name)
      this.log(`Nothing found in: ${collections.join(", ")}`)
    }
  }
}
