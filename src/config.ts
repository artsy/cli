const fs = require("fs")
const os = require("os")

export const Config = {
  path: (): string => {
    return `${os.homedir()}/.config/artsy/config.json`
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
    const data = fs.readFileSync(Config.path())
    const json = JSON.parse(data)
    return json.accessToken
  },
  writeToken: (token: string): void => {
    const options = { accessToken: token }
    const data = JSON.stringify(options, null, 2)
    fs.writeFileSync(Config.path(), data)
  },
}
