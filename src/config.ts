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
    return json.clients?.github?.token || process.env.GITHUB_TOKEN || ""
  },
  gravityId: (): string => {
    const json = Config.readConfig()
    return (
      json.clients?.gravity?.clientId || process.env.GRAVITY_CLIENT_ID || ""
    )
  },
  gravitySecret: (): string => {
    const json = Config.readConfig()
    return (
      json.clients?.gravity?.clientSecret ||
      process.env.GRAVITY_CLIENT_SECRET ||
      ""
    )
  },
  gravityToken: (isStaging = false) => {
    const json = Config.readConfig()

    const stagingTokenKey = "GRAVITY_STAGING_ACCESS_TOKEN"
    const productionTokenKey = "GRAVITY_ACCESS_TOKEN"

    if (isStaging) {
      return json.stagingAccessToken || process.env[stagingTokenKey] || ""
    } else {
      return json.accessToken || process.env[productionTokenKey] || ""
    }
  },
  opsGenieApiKey: (): string => {
    const json = Config.readConfig()
    return json.clients?.opsgenie?.apiKey || process.env.OPSGENIE_API_KEY || ""
  },
  orbitUrl: (): string => {
    const json = Config.readConfig()
    return json.clients?.orbit?.url || process.env.ORBIT_URL || ""
  },
  orbitToken: (): string => {
    const json = Config.readConfig()
    return json.clients?.orbit?.token || process.env.ORBIT_TOKEN || ""
  },
  orbitSecurityBountyRotationId: (): string => {
    const json = Config.readConfig()
    return (
      json.clients?.orbit?.securityBountyRotationId ||
      process.env.ORBIT_SECURITY_BOUNTY_ROTATION_ID ||
      ""
    )
  },
  orbitSapphireRotationId: (): string => {
    const json = Config.readConfig()
    return (
      json.clients?.orbit?.sapphireRotationId ||
      process.env.ORBIT_SAPPHIRE_ROTATION_ID ||
      ""
    )
  },
  orbitSapphireRetroRotationId: (): string => {
    const json = Config.readConfig()
    return (
      json.clients?.orbit?.sapphireRetroRotationId ||
      process.env.ORBIT_SAPPHIRE_RETRO_ROTATION_ID ||
      ""
    )
  },
  slackWebApiToken: (): string => {
    const json = Config.readConfig()
    return (
      json.clients?.slack?.webApiToken || process.env.SLACK_WEB_API_TOKEN || ""
    )
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
