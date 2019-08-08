# Artsy CLI [![CircleCI][badge]][circleci]

[badge]: https://circleci.com/gh/artsy/artsy-cli.svg?style=svg
[circleci]: https://circleci.com/gh/artsy/artsy-cli

What I'm thinking here is that we mob on creating the oclif tool and then the
streams of work could be:

* implementing identify against MP without auth
* research how we'd sign in so that a future refactor could identify with auth
  * we could just create a ClientApplication in Gravity and use those creds
  * we could allow users to sign in/out and grab the JWT for them

The thing about using oauth for a particular user is that it introduces some
things that we might not want like we try to identify a thing but that user
doesn't have access to that object. If we use a ClientApplication then that all
sorta fades away. On the other hand, sometimes I very much DO want to have the
context of a user because I'm trouble-shooting or something like that. Maybe
both would be good to support?

In the end, the ClientApplication is sure faster to get going!

Another thought is if I want to be going through MP or Gravity.

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
