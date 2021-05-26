import { Config } from "../../config"
import { defaults, environments, pages, variables } from "./data/config.json"

const homeConfig = Config.readOpenConfig()

const config = {
  environments: { ...environments, ...homeConfig.environments },
  pages: { ...pages, ...homeConfig.pages },
  variables: { ...variables, ...homeConfig.variables },
  defaults: { ...defaults, ...homeConfig.defaults },
}

export default config
