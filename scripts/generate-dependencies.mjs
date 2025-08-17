import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const dependencies = load(
  fs.readFileSync(resolve('.vitepress/data/dependencies.yaml'), 'utf8')
)

const groups = new Map()
const sections = []
const links = []

const short = version => {
  if (!version) {
    return ''
  }

  const match = version.match(/^(\d+)\.(\d+)(?:\.(\d+))?/)
  if (!match) {
    return ''
  }

  return `<Badge type="info" text="${match[1]}.${match[2]}" />`
}

for (const [name, meta] of Object.entries(dependencies.dependencies)) {
  if (!meta.group) {
    continue
  }

  const { group } = meta

  const existing = groups.get(group) ?? groups.set(group, []).get(group)

  existing.push([name, meta])
}

for (const group of [...groups.keys()].sort()) {
  sections.push(
    `## ${group}`,
    '',
    '| Name | Version | License |',
    '| --- | :---: | --- |',
  )

  groups
    .get(group)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, meta]) => {
      const version = meta.version ? short(meta.version) : ''

      sections.push(`| **[${name}][]** | ${version} | ${meta.license ?? ''} |`)
      links.push(`[${name}]: ${meta.home}`)
    })

  sections.push('')
}

sections.push(...links.sort())

fs.writeFileSync(resolve('docs/partials/dependencies.md'), sections.join('\n'))
console.log('✔ docs/partials/dependencies.md updated')
