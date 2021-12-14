import { flags } from "@oclif/command"
import { cli } from "cli-ux"
import * as githubSearchQuery from "search-query-parser"
import {
  ArtsyRepositories,
  ArtsyRepositoriesQuery,
} from "../../__generated__/graphql"
import Command from "../../base"
import { githubClient } from "../../utils/github"

const GITHUB_SEARCH_PARSER_OPTIONS = {
  keywords: [
    "archived",
    "created",
    "followers",
    "fork",
    "forks",
    "in",
    "is",
    "language",
    "license",
    "org",
    "private",
    "pushed",
    "size",
    "stars",
    "template",
    "topic",
  ],
}

export default class Repositories extends Command {
  static description = "Audit GitHub repositories."

  static args = [{ name: "query", required: false }]

  static flags = {
    ...Command.flags,
    ...cli.table.flags(),
    "default-branch": flags.string({
      description: "List only repos with a specific default branch",
    }),
  }

  async run() {
    const { args, flags } = this.parse(Repositories)

    let parsedQuery = githubSearchQuery.parse(
      args.query,
      GITHUB_SEARCH_PARSER_OPTIONS
    )

    if (typeof parsedQuery === "string") {
      parsedQuery = { text: parsedQuery }
    }

    const query = githubSearchQuery.stringify(
      { org: "artsy", ...parsedQuery },
      GITHUB_SEARCH_PARSER_OPTIONS
    )

    const {
      data: { search },
    } = await githubClient().query<ArtsyRepositoriesQuery>({
      query: ArtsyRepositories,
      variables: { query },
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
