import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const { extensions } = load(
  fs.readFileSync(resolve('.vitepress/data/extensions.yaml'), 'utf8')
)

const sections = [
  '| Name | License |',
  '| --- | --- |',
]
const links = []

Object.entries(extensions)
  .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
  .forEach(([id, meta]) => {
    sections.push(`| **[${id}][]** | ${meta.license ?? ''} |`)
    links.push(`[${id}]: ${meta.home}`)
  })

sections.push('', ...links)

fs.writeFileSync(resolve('docs/partials/extensions.md'), sections.join('\n'))
console.log('✔ docs/partials/extensions.md updated')
