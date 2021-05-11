import { flags } from "@oclif/command"
import { cli } from "cli-ux"
import {
  ArtsyRepositories,
  ArtsyRepositoriesQuery,
} from "../../__generated__/graphql"
import Command from "../../base"
import { githubClient } from "../../utils/github"

export default class Repositories extends Command {
  static description = "Audit GitHub repositories."

  static flags = {
    ...Command.flags,
    ...cli.table.flags(),
    "default-branch": flags.string({
      description: "List only repos with a specific default branch",
    }),
    pushed: flags.string({
      default: ">2021-01-01",
      description: "Pushed to",
    }),
  }

  async run() {
    const { flags } = this.parse(Repositories)

    const {
      data: { search },
    } = await githubClient().query<ArtsyRepositoriesQuery>({
      query: ArtsyRepositories,
      variables: { query: `org:artsy pushed:${flags.pushed}` },
    })

    let repositories = []
    if (flags["default-branch"]) {
      search.nodes?.forEach(repository => {
        if (repository && repository.__typename === "Repository") {
          if (repository.defaultBranchRef?.name === flags["default-branch"]) {
            repositories.push(repository)
          }
        }
      })
    } else {
      repositories = search.nodes as any[]
    }

    cli.table(
      repositories,
      {
        name: {},
        defaultBranch: {
          header: "Default Branch",
          get: row => row.defaultBranchRef && row.defaultBranchRef.name,
        },
      },
      {
        printLine: this.log,
        ...flags,
      }
    )
  }
}
