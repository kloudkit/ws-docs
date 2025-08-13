<script setup lang="ts">
import { data as envData } from '../../data/envs.data'
import type { EnvVar } from '../../data/envs.data'
import { computed } from 'vue'

const props = defineProps<{ group: string, name: string }>()

const env = computed<EnvVar>(() => envData[props.group][props.name])
const anchor = computed(() => env.value.key.toLowerCase().replaceAll('_', '-'))
</script>

<template>
  <h3 :id="anchor" class="header">
    <code>{{ env.key }}</code>

    <a class="header-anchor" :href="`#${anchor}`" :aria-label="`Permalink to &quot;${env.key}&quot;`"></a>
  </h3>

  <blockquote v-html="env.md.description" />

  <div v-if="env.longDescription" v-html="env.md.longDescription" />

  <dl class="meta">
    <dt>Type</dt>
    <dd><code>{{ env.type }}</code></dd>

    <template v-if="env.default !== undefined">
      <dt>Default</dt>
      <dd><code>{{ String(env.default) }}</code></dd>
    </template>

    <template v-if="env.since">
      <dt>Since</dt>
      <dd><Badge type="info" :text="`v${env.since}`" /></dd>
    </template>
  </dl>

  <div v-if="env.example" v-html="env.md.example" />

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

.meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: .5rem .9rem;
  margin: .5rem 0;
  font-size: .9em;
}

.meta dt {
  font-weight: 600;
  margin-left: 18px;
}

.meta dd {
  margin: 0;
}
</style>
