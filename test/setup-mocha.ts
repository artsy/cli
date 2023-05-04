import { Config } from "../src/config"

before(() => {
  Config.path = () => "mock-path"
  Config.gravityToken = () => "mock-token"
  Config.opsGenieApiKey = () => "mock-opsgenie-api-key"
  Config.slackWebApiToken = () => "mock-slack-web-api-token"
})
