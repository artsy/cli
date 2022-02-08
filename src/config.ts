const fs = require("fs")
const os = require("os")

export const Config = {
  path: (): string => {
    return `${os.homedir()}/.config/artsy`
  },
  readOpenConfig: (): any => {
    try {
      return JSON.parse(
        fs.readFileSync(`${os.homedir()}/.config/artsy-open.json`)
      )
    } catch {
      return {}
    }
  },
  gravityToken: (): string => {
    return fs.readFileSync(Config.path(), { encoding: "utf-8" })
  },
  writeToken: (token: string): void => {
    fs.writeFileSync(Config.path(), token)
  },
}
