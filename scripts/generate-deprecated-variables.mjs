import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const replacement = (use, message) => {
  if (use) {
    const anchor = use
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$|--+/g, '')

    return `[\`${use}\`](#${anchor})`
  }

  return message ? `*${message}*` : '—'
}

const configs = load(
  fs.readFileSync(resolve('.vitepress/data/env.reference.yaml'), 'utf8')
)

const sections = []

sections.push(
  '| Name | Replacement | Since | Removal |',
  '| --- | --- | :---: | :---: |',
)

Object.keys(configs.deprecated)
  .sort()
  .forEach(env => {
    const { use, since, removed, message } = configs.deprecated[env]

    sections.push(
      `| ~~*\`${env}\`*~~ | ${replacement(use, message)} | *v${since}* | *v${removed}* |`
    )
  })

fs.writeFileSync(resolve('docs/partials/deprecated-variables.md'), sections.join('\n'))
console.log('✔ docs/partials/deprecated-variables.md updated')
