<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="VPDocAsideSeeAlso" v-if="frontmatter.see">
    <div class="see-also-title">See Also</div>

    <ul>
      <li v-for="{ name, link, target } in frontmatter.see">
        <a
          class="see-also-link"
          :class="{'vp-external-link-icon': target === '_blank'}"
          :href="link"
          :target="target ?? '_self'"
          v-text="name" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.VPDocAsideSeeAlso {
  margin-top: 2em;
  margin-left: 17px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
}

.see-also-title {
  font-weight: 600;
}

.see-also-link {
  display: block;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
}

.see-also-link:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}
</style>
