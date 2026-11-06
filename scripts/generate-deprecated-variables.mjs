import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'

const cell = text => text.trim().replace(/\s+/g, ' ').replaceAll('|', '\\|')

const replacement = (use, message) => {
  if (use) {
    const anchor = use
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$|--+/g, '')

    return `[\`${use}\`](#${anchor})`
  }

  return message ? `*${cell(message)}*` : 'None'
}

export const render = deprecated => {
  const rows = Object.keys(deprecated)
    .sort()
    .map(env => {
      const { use, since, removed, message } = deprecated[env]

      return `| ~~*\`${env}\`*~~ | ${replacement(use, message)} | *v${since}* | *v${removed}* |`
    })

  return [
    '| Name | Replacement | Since | Removal |',
    '| --- | --- | :---: | :---: |',
    ...rows,
  ].join('\n')
}

const generate = () => {
  const configs = load(
    fs.readFileSync(resolve('.vitepress/data/env.reference.yaml'), 'utf8')
  )

  fs.writeFileSync(resolve('docs/partials/deprecated-variables.md'), render(configs.deprecated))
  console.log('✔ docs/partials/deprecated-variables.md updated')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate()
}
