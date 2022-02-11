import Command from "../base"
import { Config } from "../config"

import { Gravity } from "../clients/gravity"

export default class Identify extends Command {
  static description = "Identify a Gravity resource by its BSON ID"

  static flags = {
    ...Command.flags,
  }

  static args = [{ name: "id" }]

  static collectionsToCheck: CollectionMapping[] = [
    { name: "Artist", endpoint: "artist" },
    { name: "Artwork", endpoint: "artwork" },
    { name: "Partner", endpoint: "partner" },
  ]

  async run() {
    const gravity = new Gravity()
    const { args } = this.parse(Identify)
    const { id } = args

    if (!Config.gravityToken())
      this.error("You are not logged in. Run `artsy login`.")

    const gravityPromises = Identify.collectionsToCheck.map(collection => {
      const resource = `${collection.endpoint}/${id}`
      return gravity.get(resource)
    })

    const gravityResponses = await Promise.all(gravityPromises)
    const foundIndex = gravityResponses.findIndex(r => r.status === 200)

    if (foundIndex >= 0) {
      const foundCollection = Identify.collectionsToCheck[foundIndex]
      const foundResource = `${foundCollection.endpoint}/${id}`
      this.log(
        `${foundCollection.name} ${Gravity.url(`api/v1/${foundResource}`)}`
      )
    } else {
      const collections = Identify.collectionsToCheck.map(c => c.name)
      this.log(`Nothing found in: ${collections.join(", ")}`)
    }
  }
}

interface CollectionMapping {
  /** Name of the Gravity resource */
  name: string

  /** The name of the collection as it appears in the GET endpoint for the resource, i.e. /api/v1/<endpoint>/:id */
  endpoint: string
}
