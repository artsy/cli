# Artsy CLI [![CircleCI][badge]][circleci]

[badge]: https://circleci.com/gh/artsy/artsy-cli.svg?style=svg
[circleci]: https://circleci.com/gh/artsy/artsy-cli

## Install

Artsy CLI is published on npm, so installing is really easy:

```
$ npm install --global @artsy/cli
```

## Releasing

Here is a recipe for bumping the package version, merging that work to master
and then updating the release branch to point at it:

```
$ git checkout -b release-0.0.X
$ npm version 0.0.X
$ git commit -a -m "Bump version for 0.0.X"
$ hub pull-request -m "Bump version for 0.0.X" -l "Merge On Green"
# wait for PR to merge
$ git fetch
$ git checkout release
$ git reset --hard upstream/master
$ git push upstream
$ git branch -D release-0.0.X
$ git push origin :release-0.0.X
```

Once that release branch has been pushed, then Circle will take over and run the
actual npm publish command for us.
