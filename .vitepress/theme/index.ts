import { h }          from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme   from 'vitepress/theme-without-fonts'
import Home           from './Home.vue'
import SeeAlso        from './SeeAlso.vue'
import './styles.css'
import './variables.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-sans'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/600.css'
import '@fontsource/fira-sans/700.css'
import '@fontsource/fira-sans/400-italic.css'
import '@fontsource/fira-sans/500-italic.css'
import '@fontsource/victor-mono/400-italic.css'


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(SeeAlso),
      'home-features-after': () => h(Home)
    })
  },
  enhanceApp({ app, router, siteData }) {}
} satisfies Theme
