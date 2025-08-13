<script setup lang="ts">
import { data as envData } from '../../data/envs.data'
import type { EnvVar as EnvVarType } from '../../data/envs.data'
import { md } from '../utils/markdown'
import { computed } from 'vue'

const props = defineProps<{
  group: string,
  name: string,
  long?: boolean,
}>()

const key = computed(() => `WS_${props.group}_${props.name}`.toUpperCase())

const env = computed<EnvVarType>(() => envData[props.group].properties[props.name])

const description = computed<string>(() => {
  const desc = env.value.description

  return md.renderInline(desc.charAt(0).toLowerCase() + desc.slice(1))
})

const longDescription = computed(() => env.value.longDescription ? md.renderInline(env.value.longDescription) : '')
</script>

<template>
  <span class="root">
    <strong><code>{{ key }}</code>: </strong>
    <span v-html="description" />

    <template v-if="long">
      <br />
      <span v-html="longDescription" />
    </template>
  </span>
</template>

<style scoped>
.root {
  font-size: 90%;
}
</style>
