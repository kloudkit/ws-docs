import { defineConfig } from 'vitepress'
import italicSmallRenderer from './_italicSmallRenderer'
import DockerIcon from './theme/assets/DockerIcon'
import nav from './_nav'
import sidebar from './_sidebar'


export default defineConfig({
  title: 'Kloud Workspace',
  description: '🔋 A batteries included pre-configured development workspace inside a Docker container',
  appearance: 'force-dark',
  cleanUrls: true,
  srcDir: './docs',

  themeConfig: {
    nav,
    sidebar,

    langMenuLabel: 'Version',

    logo: '/favicon.ico',

    outline: 'deep',

    search: { provider: 'local' },

    socialLinks: [
      { icon: { svg: DockerIcon }, link: 'https://ghcr.io/kloudkit/workspace' },
    ],

    editLink: {
      pattern: 'https://github.com/kloudkit/ws-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    docFooter: {
      next: false,
      prev: false
    },

    footer: {
      message: 'Released under the MIT License',
      copyright: `Copyright &copy; ${new Date().getFullYear()} KloudKIT`
    },
  },

  markdown: {
    config: md => {
      md.use(italicSmallRenderer)
    },

    theme: 'catppuccin-frappe',

    container: {
      tipLabel: '💡 TIP',
      warningLabel: '⚠️ WARNING',
      dangerLabel: '🚨 DANGER',
      infoLabel: 'ℹ️ INFO',
    }
  },

  vite: {
    server: {
      allowedHosts: true
    }
  }
})
