import { Command } from "@oclif/core"

function base64decode(str: string) {
  const buff = Buffer.from(str, "base64")
  return buff.toString("ascii")
}

export default class Jwt extends Command {
  static description = "Decode a JWT access token"

  static examples = ["artsy jwt eyJhbGciOi...etc..."]

  static args = [{ name: "token" }]

  public async run(): Promise<void> {
    const { args } = await this.parse(Jwt)

    const [header, payload] = args.token.split(".")

    console.log(JSON.parse(base64decode(header)))
    console.log(JSON.parse(base64decode(payload)))
  }
}
