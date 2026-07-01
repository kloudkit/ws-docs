import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const root = load(
  fs.readFileSync(resolve('.vitepress/data/commands.yaml'), 'utf8')
)

const sections = []

const walk = command => {
  sections.push(`<CommandSection path="${command.name}" />`, '---', '')

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

fs.writeFileSync(resolve('docs/partials/commands.md'), sections.join('\n'))
console.log('✔ docs/partials/commands.md updated')
