<script setup lang="ts">
import { computed } from 'vue'

const image = "ghcr.io/kloudkit/workspace:v0.0.22"

const tag = computed(() => image.split(":")[1])
</script>

<template>
  <a alt="Docker Repo" href="https://github.com/orgs/kloudkit/packages/container/package/workspace">
    <img style="margin-left: 15px" alt="Docker Badge"
      :src="`https://img.shields.io/badge/${tag}-a?style=for-the-badge&logo=docker&logoColor=c6d0f5&label=docker&labelColor=414559&color=ef9f76`">
  </a>
</template>
