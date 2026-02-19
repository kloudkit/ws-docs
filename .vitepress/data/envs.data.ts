import { createMarkdownRenderer, defineLoader } from 'vitepress'
import type { MarkdownRenderer } from 'vitepress'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

export interface EnvVar {
  type: string
  default: string | boolean | number | null
  reference?: string
  example?: string
  description: string
  longDescription?: string
  since?: string
  deprecated?: string
  key: string
  md: {
    description: string
    longDescription?: string
    example?: string
  }
}

declare const data: Record<string, Record<string, EnvVar>>
export { data }

const file = resolve(__dirname, './env.reference.yaml')

function toExampleMd(key: string, example: string): string {
  const MAX = 66

  const prefix = `${key}="`
  let line = prefix
  const out: string[] = []

  for (const word of example.trim().split(/\s+/)) {
    if (line.length + word.length + 1 > MAX) {
      out.push(`${line.trimEnd()} \\`)
      line = " ".repeat(prefix.length) + word
    } else {
      line += (line === prefix ? "" : " ") + word
    }
  }

  out.push(`${line}"`)

  return `\`\`\`sh
${out.join("\n")}
\`\`\``
}


function toEnv(
  group: string,
  key: string,
  meta: Omit<EnvVar, 'md' | 'key'>,
  md: MarkdownRenderer
): EnvVar {
  const fullKey = `WS_${group}_${key}`.toUpperCase()

  return {
    ...meta,
    key: fullKey,
    md: {
      description: md.renderInline(meta.description),
      longDescription: meta.longDescription
        ? md.render(meta.longDescription)
        : undefined,
      example: meta.example
        ? md.render(toExampleMd(fullKey, meta.example))
        : undefined
    }
  }
}

export default defineLoader({
  watch: [file],
  async load(): Promise<typeof data> {
    const md = await createMarkdownRenderer(".")

    const configs = load(fs.readFileSync(file, 'utf8')) as {
      envs: Record<string, { name?: string, properties: Record<string, EnvVar> }>
    }

    const envs: Record<string, Record<string, EnvVar>> = {}

    for (const [group, groupDef] of Object.entries(configs.envs)) {
      envs[group] = {}

      for (const [key, meta] of Object.entries(groupDef.properties)) {
        envs[group][key] = toEnv(group, key, meta, md)
      }
    }

    return envs
  }
})
