import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const configs = load(
  fs.readFileSync(resolve('.vitepress/data/env.reference.yaml'), 'utf8')
)

const sections = []

const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

for (const [group, data] of Object.entries(configs.envs)) {
  sections.push(`## ${data.name ?? capitalizeFirst(group)}`, '')

  for (const key of Object.keys(data.properties)) {
    sections.push(
      `<EnvVarSection group="${group}" name="${key}" />`,
      '---',
      ''
    )
  }

  if (sections.length >= 2 && sections.at(-2) === '---') {
    sections.splice(-2)
  }
}

sections.push('')

fs.writeFileSync(resolve('docs/partials/environment-variables.md'), sections.join('\n'))
console.log('✔ docs/partials/environment-variables.md updated')
