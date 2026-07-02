import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'

const escape = value =>
  (value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const cell = value => escape(value).replaceAll('|', '\\|')

const flag = ({ name, shorthand }) =>
  shorthand ? `--${name}, -${shorthand}` : `--${name}`

const blockquote = description =>
  escape(description)
    .split('\n')
    .map(line => (line === '' ? '>' : `> ${line}`))
    .join('\n')

const optionsTable = options => {
  const rows = ['| Flag | Description | Default |', '| --- | --- | --- |']

  for (const option of options) {
    const value = option.default ? `\`${option.default}\`` : ''

    rows.push(`| \`${flag(option)}\` | ${cell(option.usage)} | ${value} |`)
  }

  return rows.join('\n')
}

export const section = command => {
  const badges = []

  if (command.aliases?.length) {
    badges.push(`<Badge type="info" text="alias: ${command.aliases.join(', ')}" />`)
  }

  if (command.since) {
    badges.push(`<Badge type="tip" text="v${command.since}" />`)
  }

  if (command.deprecated) {
    badges.push(`<Badge type="warning" text="deprecated v${command.deprecated}" />`)
  }

  const title = [`\`${command.name}\``, ...badges].join(' ')
  const lines = [`### ${title}`, '']

  if (command.description) {
    lines.push(blockquote(command.description), '')
  }

  if (command.usage) {
    lines.push(`\`${command.usage}\``, '')
  }

  if (command.options?.length) {
    lines.push(optionsTable(command.options), '')
  }

  if (command.example) {
    lines.push('```sh', command.example, '```', '')
  }

  return lines.join('\n').trimEnd()
}

const render = root => {
  const sections = []

  const walk = command => {
    sections.push(section(command), '', '---', '')

    for (const child of command.commands ?? []) {
      walk(child)
    }
  }

  for (const group of root.commands ?? []) {
    walk(group)
  }

  if (sections.length >= 2 && sections.at(-2) === '---') {
    sections.splice(-2)
  }

  sections.push('')

  return sections.join('\n')
}

const generate = () => {
  const root = load(
    fs.readFileSync(resolve('.vitepress/data/commands.yaml'), 'utf8')
  )

  fs.writeFileSync(resolve('docs/partials/commands.md'), render(root))
  console.log('✔ docs/partials/commands.md updated')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate()
}
