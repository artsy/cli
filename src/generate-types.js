const fetch = require("cross-fetch")
const fs = require("fs")

require("dotenv").config()

fetch(`https://api.github.com/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
})
  .then(result => {
    console.log(result.json())
    return result.json()
  })
  .then(result => {
    const possibleTypes = {}

    result.data.__schema.types.forEach(supertype => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] = supertype.possibleTypes.map(
          subtype => subtype.name
        )
      }
    })

    fs.writeFile("./possibleTypes.json", JSON.stringify(possibleTypes), err => {
      if (err) {
        console.error("Error writing possibleTypes.json", err)
      } else {
        console.log("Fragment types successfully extracted!")
      }
    })
  })
