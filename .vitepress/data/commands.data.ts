import { createMarkdownRenderer, defineLoader } from 'vitepress'
import type { MarkdownRenderer } from 'vitepress'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

export interface CommandOption {
  name: string
  shorthand?: string
  default?: string
  usage?: string
}

export interface Command {
  name: string
  synopsis?: string
  description?: string
  usage?: string
  aliases?: string[]
  example?: string
  options?: CommandOption[]
  commands?: Command[]
  md: {
    description?: string
  }
}

declare const data: Record<string, Command>
export { data }

const file = resolve(__dirname, './commands.yaml')

function flatten(
  cmd: Command,
  md: MarkdownRenderer,
  into: Record<string, Command>
): void {
  into[cmd.name] = {
    ...cmd,
    md: {
      description: cmd.description ? md.renderInline(cmd.description) : undefined
    }
  }

  for (const child of cmd.commands ?? []) {
    flatten(child, md, into)
  }
}

export default defineLoader({
  watch: [file],
  async load(): Promise<typeof data> {
    const md = await createMarkdownRenderer('.')

    const root = load(fs.readFileSync(file, 'utf8')) as Command

    const commands: Record<string, Command> = {}

    for (const group of root.commands ?? []) {
      flatten(group, md, commands)
    }

    return commands
  }
})
