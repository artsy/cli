const fs = require('fs')
const os = require('os')

export const Config = {
  path: (): string => {
    return `${os.homedir()}/.config/artsy`
  },
  readToken: (): string => {
    return fs.readFileSync(Config.path(), {encoding: 'utf-8'})
  },
  writeToken: (token: string): void => {
    fs.writeFileSync(Config.path(), token)
  }
}
