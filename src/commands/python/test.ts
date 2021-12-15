const { execFile } = require("child_process")
const path = require("path")

import Command from "../../base"

export default class Test extends Command {
  async run() {
    const filePath = path.join(__dirname, "../../../scripts/test.py")

    execFile(filePath, async (error: Error, stdout: string) => {
      let result

      if (error) {
        result = error.toString()
      } else {
        result = stdout
      }

      this.log(result.trim())
    })
  }
}
