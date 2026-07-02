import { test } from 'node:test'
import assert from 'node:assert/strict'
import { section } from './generate-commands.mjs'

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
