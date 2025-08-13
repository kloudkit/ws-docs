<script setup lang="ts">
import { data as envData } from '../../data/envs.data'
import type { EnvVar } from '../../data/envs.data'
import { computed } from 'vue'

const props = defineProps<{ group: string, name: string }>()

const env = computed<EnvVar>(() => envData[props.group][props.name])
</script>

<template>
  <span class="root">
    <strong><code>{{ env.key }}</code>: </strong>

    <span v-html="env.md.description" />

    <slot name="suffix" />
  </span>
</template>

<style scoped>
.root {
  font-size: 90%;
}
</style>
