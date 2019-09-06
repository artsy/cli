import { Config } from "../src/config"

before(() => {
  Config.path = () => "mock-path"
  Config.readToken = () => "mock-token"
  Config.writeToken = () => null // noop
})
