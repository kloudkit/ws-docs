import { h }          from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme   from 'vitepress/theme-without-fonts'
import EnvVar         from './components/EnvVar.vue'
import EnvVarSection  from './components/EnvVarSection.vue'
import Home           from './components/Home.vue'
import RepoStars      from './components/RepoStars.vue'
import SeeAlso        from './components/SeeAlso.vue'
import './styles.css'
import './variables.css'
import '@catppuccin/vitepress/theme/frappe/teal.css'
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
      'home-features-after': () => h(Home),
      'nav-bar-content-after': () => h(RepoStars)
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('EnvVar', EnvVar)
    app.component('EnvVarSection', EnvVarSection)
  }
} satisfies Theme
