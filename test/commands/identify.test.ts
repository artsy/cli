import { expect, test } from "@oclif/test"

describe("identify", () => {
  describe("when the artwork exists", () => {
    test
      .nock("https://api.artsy.net", api =>
        api
          .get("/api/v1/artist/abc123")
          .reply(404)
          .get("/api/v1/artwork/abc123")
          .reply(200)
          .get("/api/v1/partner/abc123")
          .reply(404)
      )
      .stdout()
      .command(["identify", "abc123"])
      .it("displays a found artwork message", ctx => {
        expect(ctx.stdout).to.equal(
          "Artwork https://api.artsy.net/api/v1/artwork/abc123\n"
        )
      })
  })

  describe("when the artist exists", () => {
    test
      .nock("https://api.artsy.net", api =>
        api
          .get("/api/v1/artist/abc123")
          .reply(200)
          .get("/api/v1/artwork/abc123")
          .reply(404)
          .get("/api/v1/partner/abc123")
          .reply(404)
      )
      .stdout()
      .command(["identify", "abc123"])
      .it("displays a found artist message", ctx => {
        expect(ctx.stdout).to.equal(
          "Artist https://api.artsy.net/api/v1/artist/abc123\n"
        )
      })
  })

  describe("when the partner exists", () => {
    test
      .nock("https://api.artsy.net", api =>
        api
          .get("/api/v1/artist/abc123")
          .reply(404)
          .get("/api/v1/artwork/abc123")
          .reply(404)
          .get("/api/v1/partner/abc123")
          .reply(200)
      )
      .stdout()
      .command(["identify", "abc123"])
      .it("displays a found partner message", ctx => {
        expect(ctx.stdout).to.equal(
          "Partner https://api.artsy.net/api/v1/partner/abc123\n"
        )
      })
  })

  describe("when nothing is found", () => {
    test
      .nock("https://api.artsy.net", api =>
        api
          .get("/api/v1/artwork/abc123")
          .reply(404)
          .get("/api/v1/artist/abc123")
          .reply(404)
          .get("/api/v1/partner/abc123")
          .reply(404)
      )
      .stdout()
      .command(["identify", "abc123"])
      .it("displays a not-found message", ctx => {
        expect(ctx.stdout).to.equal(
          "Nothing found in: Artist, Artwork, Partner\n"
        )
      })
  })
})
