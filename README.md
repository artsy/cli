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
