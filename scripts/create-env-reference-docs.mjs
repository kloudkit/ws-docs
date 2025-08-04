import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const configs = load(
  fs.readFileSync(resolve('docs/manifests/env.reference.yaml'), 'utf8')
)

const sections = []

const addUrl = url => url ? `[**Read More** →](${url})` : ''
const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1)
const addExample = (env, example) => {
  const MAX = 70

  const prefix = `${env}="`
  let line = prefix
  const out = []

  for (const word of example.trim().split(/\s+/)) {
    if (line.length + word.length + 1 > MAX) {
      out.push(`${line.trimEnd()} \\`)
      line = " ".repeat(prefix.length) + word
    } else {
      line += (line === prefix ? "" : " ") + word
    }
  }

  out.push(`${line}"`)

  return `
\`\`\`sh
${out.join("\n")}
\`\`\`
  `
}

for (const [group, data] of Object.entries(configs.envs)) {
  sections.push(`## ${data.name ?? capitalizeFirst(group)}`, '')

  for (const [key, meta] of Object.entries(data.properties)) {
    const env = `WS_${group.toUpperCase()}_${key.toUpperCase()}`

    sections.push(
      `### \`${env}\``,
      '',
      `> ${meta.description}`,
      ''
    )

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
        ? `- **Example:** ${addExample(env, meta.example)}`
        : null
    ].filter(Boolean)

    sections.push(...details, '')

    if (meta.reference) {
      sections.push(addUrl(meta.reference), '')
    }

    sections.push('---', '')
  }

  if (sections.length >= 2 && sections.at(-2) === '---') {
    sections.splice(-2)
  }
}

sections.push(
  '## Deprecated',
  '',
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

sections.push('')

fs.writeFileSync(resolve('docs/partials/environment-variables.md'), sections.join('\n'))
console.log('✔ docs/partials/environment-variables.md updated')
