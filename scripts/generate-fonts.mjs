import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const { fonts } = load(
  fs.readFileSync(resolve('.vitepress/data/fonts.yaml'), 'utf8')
)

const sections = [
  '| Name | License |',
  '| --- | --- |',
]

const sortKey = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

Object.values(fonts)
  .sort((a, b) => sortKey(a.name).localeCompare(sortKey(b.name)))
  .forEach((meta) => {
    sections.push(`| **[${meta.name}](${meta.home})** | ${meta.license ?? ''} |`)
  })

fs.writeFileSync(resolve('docs/partials/fonts.md'), sections.join('\n'))
console.log('✔ docs/partials/fonts.md updated')
