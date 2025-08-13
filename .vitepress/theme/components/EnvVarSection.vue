<script setup lang="ts">
import { data as envData } from '../../data/envs.data'
import type { EnvVar as EnvVarType } from '../../data/envs.data'
import { md } from '../utils/markdown'
import { computed } from 'vue'

const props = defineProps<{ group: string, name: string }>()

const key = computed(() => `WS_${props.group}_${props.name}`.toUpperCase())

const env = computed<EnvVarType>(() => envData[props.group].properties[props.name])
const anchor = computed(() => key.value.toLowerCase().replaceAll('_', '-'))


const example = computed(() => {
  const MAX = 66

  const prefix = `${key.value}="`
  let line = prefix
  const out: string[] = []

  for (const word of env.value.example!.trim().split(/\s+/)) {
    if (line.length + word.length + 1 > MAX) {
      out.push(`${line.trimEnd()} \\`)
      line = " ".repeat(prefix.length) + word
    } else {
      line += (line === prefix ? "" : " ") + word
    }
  }

  out.push(`${line}"`)

  return out.join("\n")
})
</script>

<template>
  <h3 :id="anchor" class="header">
    <code>{{ key }}</code>

    <a class="header-anchor" :href="`#${anchor}`" :aria-label="`Permalink to &quot;${key}&quot;`"></a>

    <Badge v-if="env.since" type="tip" :text="`Since ${env.since}`" />
  </h3>

  <blockquote v-html="md.renderInline(env.description)" />

  <div v-if="env.longDescription" v-html="md.render(env.longDescription)" />

  <ul>
    <li>
      <strong>Type: </strong>
      <code>{{ env.type }}</code>
    </li>

    <li v-if="env.default">
      <strong>Default: </strong>
      <code>{{ env.default }}</code>
    </li>

    <li v-if="env.example">
      <strong>Example: </strong>
      <div class="language-sh">
        <button title="Copy Code" class="copy"></button>
        <span class="lang">env</span>

        <pre class="shiki catppuccin-frappe vp-code"
          tabindex="0"><code><span class="line" v-html="example" /></code></pre>
      </div>
    </li>
  </ul>

  <a v-if="env.reference" :href="env.reference">
    <strong>Read More →</strong>
  </a>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
