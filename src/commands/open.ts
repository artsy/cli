import { flags } from "@oclif/command"
import Command from "../base"

import openPage from "../lib/open"
import config from "../lib/open/config"

export default class Open extends Command {
  static description =
    "Open Artsy links with the iOS/Android emulator or the browser"

  static examples = [
    `$ artsy open artwork
opens "https://www.artsy.net/artwork/banksy-love-rat-signed-16" on iOS`,
    `$ artsy open artwork/andy-warhol-watercolor-paint-kit-with-brushes-11
opens "https://www.artsy.net/artwork/andy-warhol-watercolor-paint-kit-with-brushes-11" on iOS`,
    `artsy open artist artistID:andy-warhol
Open "https://www.artsy.net/artist/andy-warhol" on iOS`,
    `$ artsy open home -a
opens "https://www.artsy.net/" on Android`,
    `$ artsy open about -l
opens "localhost/about" on iOS`,
    `\nDOCS`,
    `https://github.com/artsy/cli/blob/master/docs/open.md`,
    `\nALL PAGES`,
    Object.keys(config.pages).join(", "),
  ]

  static flags = {
    ...Command.flags,
    ios: flags.boolean({ char: "i" }),
    android: flags.boolean({ char: "a" }),
    web: flags.boolean({ char: "w" }),
    production: flags.boolean({ char: "p" }),
    staging: flags.boolean({ char: "s" }),
    local: flags.boolean({ char: "l" }),
  }

  static args = [
    { name: "page", required: false, default: "/" },
    { name: "customVariables", required: false },
  ]

  parsePlatform(): string | undefined {
    const { flags } = this.parse(Open)

    if (flags.ios) return "ios"
    if (flags.android) return "android"
    if (flags.web) return "web"
  }

  parseEnvironment(): string | undefined {
    const { flags } = this.parse(Open)

    if (flags.staging) return "staging"
    if (flags.production) return "production"
    if (flags.local) return "local"
  }

  parseCustomVariables(): object {
    const {
      args: { customVariables },
    } = this.parse(Open)

    if (!customVariables) return {}

    return customVariables.split(",").reduce((acc: any, element: string) => {
      const [key, value] = element.split(":")
      acc[key] = value
      return acc
    }, {})
  }

  async run() {
    const { args } = this.parse(Open)

    openPage({
      page: args.page as string,
      platform: this.parsePlatform(),
      environment: this.parseEnvironment(),
      customVariables: this.parseCustomVariables(),
    })
  }
}
