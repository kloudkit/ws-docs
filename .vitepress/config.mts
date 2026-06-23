import { defineConfig } from 'vitepress'
import italicSmallRenderer from './_italicSmallRenderer'
import nav from './_nav'
import sidebar from './_sidebar'


export default defineConfig({
  title: 'Kloud Workspace',
  description: '🔋 A batteries included pre-configured development workspace inside a Docker container',
  appearance: 'force-dark',
  cleanUrls: true,
  srcDir: './docs',

  sitemap: {
    hostname: 'https://ws.kloudkit.com'
  },

  head: [
    ['meta', { name: 'theme-color', content: '#303446' }],
    ['meta', { property: 'og:site_name', content: 'Kloud Workspace' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://ws.kloudkit.com/logo.png' }],
    ['meta', { property: 'og:image:alt', content: 'Kloud Workspace logo' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: 'https://ws.kloudkit.com/logo.png' }],
  ],

  transformHead: ({ pageData }) => {
    const title = pageData.title
      ? `${pageData.title} | Kloud Workspace`
      : 'Kloud Workspace'
    const description =
      pageData.description ||
      pageData.frontmatter.description ||
      '🔋 A batteries included pre-configured development workspace inside a Docker container'
    const url =
      'https://ws.kloudkit.com/' +
      pageData.relativePath.replace(/(index)?\.md$/, '').replace(/\/$/, '')

    return [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['link', { rel: 'canonical', href: url }],
    ]
  },

  themeConfig: {
    nav,
    sidebar,

    logo: '/favicon.ico',

    outline: 'deep',

    search: { provider: 'local' },

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
