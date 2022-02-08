import { Config } from "../src/config"

before(() => {
  Config.path = () => "mock-path"
  Config.gravityToken = () => "mock-token"
  Config.writeToken = () => null // noop
})
