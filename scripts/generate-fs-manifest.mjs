import fs from 'node:fs'
import { resolve } from 'node:path'

const DATA_PATH = resolve('.vitepress/data/fs-manifest.json')
const OUT_PATH = resolve('docs/partials/fs-manifest.md')
const PLACEHOLDER = '*Pending first sync from `ws-feature-store` CI.*\n'

if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(OUT_PATH, PLACEHOLDER)
  console.log('✔ docs/partials/fs-manifest.md updated (placeholder — data file missing)')
  process.exit(0)
}

const manifest = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

const groups = { apt: [], artifact: [] }

for (const entry of manifest.packages) {
  if (groups[entry.type]) {
    groups[entry.type].push(entry)
  }
}

const sections = [
  `*Built: ${manifest.built}*`,
  '',
]

const renderGroup = (heading, entries) => {
  if (entries.length === 0) {
    return
  }

  sections.push(
    `## ${heading}`,
    '',
    '| Name | Version | Architecture |',
    '| --- | :---: | :---: |',
  )

  const groups = new Map()

  for (const { name, version, architecture } of entries) {
    const key = `${name}\0${version ?? ''}`
    const existing = groups.get(key) ?? groups.set(key, { name, version, architectures: [] }).get(key)
    if (architecture) {
      existing.architectures.push(architecture)
    }
  }

  Array.from(groups.values())
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .forEach(({ name, version, architectures }) => {
      const arch = architectures.length === 0
        ? '-'
        : Array.from(new Set(architectures))
            .sort()
            .map(a => a === 'all' ? '`*`' : `\`${a}\``)
            .join(', ')

      sections.push(
        `| \`${name}\` | ${version ?? '-'} | ${arch} |`
      )
    })

  sections.push('')
}

renderGroup('APT Packages', groups.apt)
renderGroup('Artifacts', groups.artifact)

fs.writeFileSync(OUT_PATH, sections.join('\n'))
console.log('✔ docs/partials/fs-manifest.md updated')
