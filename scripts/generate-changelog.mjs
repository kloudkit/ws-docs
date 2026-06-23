import fs from 'node:fs'
import { resolve } from 'node:path'

const DATA_PATH = resolve('.vitepress/data/CHANGELOG.md')
const OUT_PATH = resolve('docs/partials/changelog.md')
const PLACEHOLDER = '*Pending first changelog sync from `workspace` CI.*\n'

if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(OUT_PATH, PLACEHOLDER)
  console.log('✔ docs/partials/changelog.md updated (placeholder — data file missing)')
  process.exit(0)
}

const raw = fs.readFileSync(DATA_PATH, 'utf8')

// Strip the leading `# Changelog` header block (git-cliff header); the host
// page owns the page heading and frontmatter.
const body = raw.replace(/^#\s+Changelog\s*\n+/, '').trimStart()

fs.writeFileSync(OUT_PATH, `${body.replace(/\s*$/, '')}\n`)
console.log('✔ docs/partials/changelog.md updated')
