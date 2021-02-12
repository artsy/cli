import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from "apollo-cache-inmemory"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"

import "cross-fetch/polyfill"

const { schema } = require("@octokit/graphql-schema")

export function githubClient(): ApolloClient<NormalizedCacheObject> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      "You need to provide a `GITHUB_TOKEN` env variable."
    );
  }

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: schema.json
  });

  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }),
    cache: new InMemoryCache({ fragmentMatcher }),
  })
}
