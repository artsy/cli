# Artsy CLI [![CircleCI][badge]][circleci]

[badge]: https://circleci.com/gh/artsy/cli/tree/main.svg?style=svg
[circleci]: https://circleci.com/gh/artsy/cli/tree/main

## Install

Artsy CLI is published on npm, so installing is really easy:

```
$ npm install --global @artsy/cli
```

## Setup

In order to access shared config, run these commands:

```
$ mkdir -p ~/.config/artsy
$ aws s3 cp s3://artsy-citadel/cli/config.json ~/.config/artsy/
```

## Docs

- [Artsy Open Docs](docs/open.md)

## Releasing

The release process happens automatically on every PR merge thanks to [auto](https://github.com/intuit/auto). To ensure
the proper version is released for your PR please chose one of the following labels

- `Version: Major`
- `Version: Minor`
- `Version: Patch`
- `Version: Trivial`
