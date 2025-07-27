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

    outline: 'deep',

    logo: '/favicon.ico',

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
    theme: 'catppuccin-frappe'
  },

  vite: {
    server: {
      allowedHosts: true
    }
  }
})
