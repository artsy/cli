import { expect, test } from "@oclif/test"
import { Config } from "../../../src/config"
const sinon = require("sinon")
const { Android, Ios } = require("uri-scheme")

beforeEach(() => {
  sinon.stub(Config, "readOpenConfig").callsFake(() => ({}))
  sinon.stub(Android, "openAsync").callsFake()
  sinon.stub(Ios, "openAsync").callsFake()
})

afterEach(() => {
  sinon.restore()
})

describe("open default with alias", () => {
  test
    .stdout()
    .command(["open", "artwork"])
    .it("opens artwork on ios", () => {
      expect(
        Ios.openAsync.calledWith({
          uri: "https://www.artsy.net/artwork/banksy-love-rat-signed-16",
        })
      ).to.be.ok
    })
})

describe("open default without alias", () => {
  test
    .stdout()
    .command(["open", "/artworks"])
    .it("opens artworks on ios", () => {
      expect(
        Ios.openAsync.calledWith({
          uri: "https://www.artsy.net/artworks",
        })
      ).to.be.ok
    })
})

describe("open default on android", () => {
  test
    .stdout()
    .command(["open", "/artworks", "-a"])
    .it("opens artwork on android", () => {
      expect(
        Android.openAsync.calledWith({
          uri: "https://www.artsy.net/artworks",
        })
      ).to.be.ok
    })
})

describe("open default on ios", () => {
  test
    .stdout()
    .command(["open", "/artworks", "-i"])
    .it("opens artwork on ios", () => {
      expect(
        Ios.openAsync.calledWith({
          uri: "https://www.artsy.net/artworks",
        })
      ).to.be.ok
    })
})

describe("open default on production", () => {
  test
    .stdout()
    .command(["open", "/artworks", "-p"])
    .it("opens artworks on ios", () => {
      expect(
        Ios.openAsync.calledWith({
          uri: "https://www.artsy.net/artworks",
        })
      ).to.be.ok
    })
})

describe("open default on staging", () => {
  test
    .stdout()
    .command(["open", "/artworks", "-s"])
    .it("opens artworks on ios", () => {
      expect(
        Ios.openAsync.calledWith({
          uri: "https://staging.artsy.net/artworks",
        })
      ).to.be.ok
    })
})

describe("open default on localhost", () => {
  test
    .stdout()
    .command(["open", "/artworks", "-l"])
    .it("opens artworks on ios", () => {
      expect(
        Ios.openAsync.calledWith({
          uri: "localhost:3000/artworks",
        })
      ).to.be.ok
    })
})
