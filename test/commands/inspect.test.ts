import {expect, test} from '@oclif/test'

describe('inspect-query', () => {
  test
  .stdout()
  .command(['inspect-query'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['inspect-query', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
