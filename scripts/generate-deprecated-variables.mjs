import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

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
    const { use, since, removed } = configs.deprecated[env]

    const anchor = use
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$|--+/g, '')

    sections.push(
      `| ~~*\`${env}\`*~~ | [\`${use}\`](#${anchor}) | *v${since}* | *v${removed}* |`
    )
  })

fs.writeFileSync(resolve('docs/partials/deprecated-variables.md'), sections.join('\n'))
console.log('✔ docs/partials/deprecated-variables.md updated')
