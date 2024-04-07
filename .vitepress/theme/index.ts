import { h }          from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme   from 'vitepress/theme'
import './style.css'
import './palette.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/victor-mono/400-italic.css'


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
