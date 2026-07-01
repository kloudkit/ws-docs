<script setup lang="ts">
import { data as commandData } from '../../data/commands.data'
import type { Command } from '../../data/commands.data'
import { computed } from 'vue'

const props = defineProps<{ path: string }>()

const cmd = computed<Command>(() => commandData[props.path])
const anchor = computed(() => cmd.value.name.replaceAll(' ', '-'))

function flag(name: string, shorthand?: string): string {
  return shorthand ? `--${name}, -${shorthand}` : `--${name}`
}
</script>

<template>
  <h3 :id="anchor" class="header">
    <code>{{ cmd.name }}</code>
    <Badge v-if="cmd.aliases?.length" type="info" :text="`alias: ${cmd.aliases.join(', ')}`" />

    <a class="header-anchor" :href="`#${anchor}`" :aria-label="`Permalink to &quot;${cmd.name}&quot;`"></a>
  </h3>

  <blockquote v-if="cmd.md.description" v-html="cmd.md.description" />

  <p v-if="cmd.usage" class="usage"><code>{{ cmd.usage }}</code></p>

  <table v-if="cmd.options?.length">
    <thead>
      <tr>
        <th>Flag</th>
        <th>Description</th>
        <th>Default</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="option in cmd.options" :key="option.name">
        <td><code>{{ flag(option.name, option.shorthand) }}</code></td>
        <td>{{ option.usage }}</td>
        <td><code v-if="option.default">{{ option.default }}</code></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usage {
  margin: .4rem 0;
}
</style>
