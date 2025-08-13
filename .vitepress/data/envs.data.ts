import { defineLoader } from 'vitepress'
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
}

export interface EnvGroup {
  name?: string
  properties: Record<string, EnvVar>
}

declare const data: Record<string, EnvGroup>
export { data }

const file =resolve(__dirname, './env.reference.yaml')

export default defineLoader({
  watch: [file.toString()],
  async load(): Promise<Record<string, EnvGroup>> {
    const envs = load(fs.readFileSync(file, 'utf8')) as any

    return envs.envs
  }
})
