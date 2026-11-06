import { test } from 'node:test'
import assert from 'node:assert/strict'
import { render, section } from './generate-commands.mjs'

test('renders the example as a fenced sh block after the options table', () => {
  const output = section({
    name: 'ws-cli demo',
    description: 'A demo command.',
    options: [{ name: 'flag', usage: 'A flag' }],
    example: '# do a thing\nws demo --flag',
  })

  const optionsIndex = output.indexOf('| Flag | Description | Default |')
  const fenceIndex = output.indexOf('```sh')

  assert.ok(fenceIndex > optionsIndex)
  assert.ok(output.includes('```sh\n# do a thing\nws demo --flag\n```'))
})

test('omits the fence when the command has no example', () => {
  const output = section({
    name: 'ws-cli bare',
    description: 'No example here.',
  })

  assert.ok(!output.includes('```'))
})

test('skips unreleased commands and their subcommands', () => {
  const output = render({
    commands: [
      {
        name: 'ws-cli shipped',
        since: '0.5.0',
        commands: [
          { name: 'ws-cli shipped child', since: '0.5.0' },
          {
            name: 'ws-cli shipped pending',
            since: 'next',
            commands: [{ name: 'ws-cli shipped pending child', since: 'next' }],
          },
        ],
      },
      { name: 'ws-cli upcoming', since: 'next' },
    ],
  })

  assert.ok(output.includes('`ws-cli shipped`'))
  assert.ok(output.includes('`ws-cli shipped child`'))
  assert.ok(!output.includes('pending'))
  assert.ok(!output.includes('upcoming'))
  assert.ok(!output.includes('vnext'))
  assert.ok(!output.trimEnd().endsWith('---'))
})
