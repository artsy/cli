# Contributing

## Set up the repo

```sh
git clone git@github.com:artsy/cli.git
cd cli
yarn install
```

## Run tests

```sh
yarn lint
yarn test
```

## Run the local development version of the cli

```sh
./bin/run
```

## Scaffold a new command

```sh
oclif generate command myawesomecommand
```

## Run tests for the new command

```sh
yarn mocha test/commands/myawesomecommand.test.ts
```

## Execute the new command

```sh
./bin/run myawesomecommand arg1 arg2
```
