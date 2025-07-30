import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const configs = load(
  fs.readFileSync(resolve('scripts/env.reference.yaml'), 'utf8')
)

const sections = []

const addUrl = url => url ? ` [->](${url})` : ''
const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

for (const [group, data] of Object.entries(configs.envs)) {
  sections.push(
    `### ${data.name ?? capitalizeFirst(group)} ${addUrl(data.reference ?? '')}`.trim(),
    ''
  )

  for (const [key, meta] of Object.entries(data.properties)) {
    const env = `WS_${group.toUpperCase()}_${key.toUpperCase()}`

    sections.push(
      `#### \`${env}\` ${addUrl(meta.reference)}`.trim(),
      ''
    )

    sections.push(`> ${meta.description}`, '')

    if (meta.long_description) {
      sections.push(meta.long_description.trim(), '')
    }

    const details = [
      `- **Type:** \`${meta.type}\``,
      meta.default !== undefined
        ? `- **Default:** \`${String(meta.default)}\``
        : null,
      meta.since
        ? `- **Since:** *v${meta.since}*`
        : null,
      meta.example
        ? `- **Example:** \`${meta.example.trim()}\``
        : null
    ].filter(Boolean)

    sections.push(...details, '')
  }
}

sections.push('### Deprecated', '')

Object.keys(configs.deprecated)
  .sort()
  .forEach(env => {
    const { use, since, removed } = configs.deprecated[env]

    const anchor = use
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$|--+/g, '')

    sections.push(
      `- **\`${env}\`** *(since v${since}, removal v${removed})* → use [\`${use}\`](#${anchor}).`
    )
  })

sections.push('')

fs.writeFileSync(resolve('docs/partials/environment-variables.md'), sections.join('\n'))
console.log('✔ docs/partials/environment-variables.md updated')
