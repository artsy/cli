export const RepositoriesFixture = {
  data: {
    search: {
      __typename: "SearchResultItemConnection",
      nodes: [
        {
          __typename: "Repository",
          name: "eigen",
          defaultBranchRef: {
            __typename: "Ref",
            name: "master",
          },
        },
      ],
    },
  },
}
