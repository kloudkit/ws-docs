import { h }          from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme   from 'vitepress/theme'
import SeeAlso        from './SeeAlso.vue'
import './styles.css'
import './variables.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/victor-mono/400-italic.css'


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(SeeAlso)
    })
  },
  enhanceApp({ app, router, siteData }) {}
} satisfies Theme
