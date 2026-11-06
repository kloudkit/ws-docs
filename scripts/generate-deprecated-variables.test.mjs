import { test } from 'node:test'
import assert from 'node:assert/strict'
import { render } from './generate-deprecated-variables.mjs'

test('keeps a multi-line message on its table row', () => {
  const output = render({
    WS_OLD_FILE: {
      since: '0.3.0',
      removed: '0.5.0',
      message: 'Set WS_OLD=file:/path or mount the secret at\n/run/secrets/old.\n',
    },
  })

  const lines = output.split('\n')

  assert.equal(lines.length, 3)
  assert.ok(lines[2].includes('*Set WS_OLD=file:/path or mount the secret at /run/secrets/old.*'))
})

test('escapes a pipe inside a message', () => {
  const output = render({
    WS_PIPED: { since: '0.1.0', removed: '0.2.0', message: 'Use a | b instead.' },
  })

  assert.ok(output.includes('*Use a \\| b instead.*'))
})

test('links the replacement variable and sorts the rows', () => {
  const output = render({
    WS_ZETA: { since: '0.1.0', removed: '0.2.0', use: 'WS_NEW_ZETA' },
    WS_ALPHA: { since: '0.1.0', removed: '0.2.0', use: 'WS_NEW_ALPHA' },
  })

  const lines = output.split('\n')

  assert.ok(lines[2].startsWith('| ~~*`WS_ALPHA`*~~ | [`WS_NEW_ALPHA`](#ws-new-alpha) |'))
  assert.ok(lines[3].startsWith('| ~~*`WS_ZETA`*~~'))
})
