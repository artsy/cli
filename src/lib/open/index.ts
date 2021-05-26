const { Android, Ios } = require("uri-scheme")
const dashify = require("dashify")
const template = require("colon-template")
const { cli } = require("cli-ux")

import config from "./config"
interface OpenPageProps {
  page: string
  platform: string | undefined
  environment: string | undefined
  customVariables: object
}

const openUri = (uri: string, platform: string) => {
  switch (platform) {
    case "android":
      Android.openAsync({ uri })
      break
    case "ios":
      Ios.openAsync({ uri })
      break
    case "web":
      cli.open(uri)
  }
}

const removeTrailingSlash = (path: string): string => {
  return path.replace(/^\//, "")
}

const getURI = (
  input: string,
  variables: object,
  environment: string
): string => {
  if (input.includes("://")) return input

  const { pages, environments } = config

  const templatePath = removeTrailingSlash(pages[dashify(input)] || input)

  const path = template(templatePath, variables)

  return `${environments[environment]}/${path}`
}

const openPage = ({
  page,
  platform,
  environment,
  customVariables,
}: OpenPageProps) => {
  const variables = { ...config.variables, ...customVariables }
  const env = environment || config.defaults.environment
  const uri = getURI(page, variables, env)

  console.log(`Open "${uri}" on ${platform || config.defaults.platform}`)

  openUri(uri, platform || config.defaults.platform)
}

export default openPage
