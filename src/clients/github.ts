import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from "apollo-cache-inmemory"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"

import "cross-fetch/polyfill"

import { Config } from "../config"

const { schema } = require("@octokit/graphql-schema")

export function githubClient(): ApolloClient<NormalizedCacheObject> {
  const githubToken = Config.githubToken()

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: schema.json,
  })

  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        authorization: `token ${githubToken}`,
      },
    }),
    cache: new InMemoryCache({ fragmentMatcher }),
  })
}
