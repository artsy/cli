const fs = require("fs")
const os = require("os")

export const Config = {
  path: (): string => {
    return `${os.homedir()}/.config/artsy/config.json`
  },
  readConfig: (): any => {
    try {
      const path = Config.path()
      const data = fs.readFileSync(path)
      return JSON.parse(data)
    } catch {
      return {}
    }
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
  githubToken: (): string => {
    const json = Config.readConfig()
    return json.clients?.github?.token
  },
  gravityId: (): string => {
    const json = Config.readConfig()
    return json.clients.gravity.clientId
  },
  gravitySecret: (): string => {
    const json = Config.readConfig()
    return json.clients.gravity.clientSecret
  },
  gravityToken: (): string => {
    const json = Config.readConfig()
    return json.accessToken
  },
  updateConfig: (newOptions: object): void => {
    const existingOptions = Config.readConfig()
    const options = {
      ...existingOptions,
      ...newOptions,
    }
    Config.writeConfig(options)
  },
  writeConfig: (options: object): void => {
    const data = JSON.stringify(options, null, 2)
    fs.writeFileSync(Config.path(), data)
  },
}
