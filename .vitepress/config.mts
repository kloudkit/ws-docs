import { defineConfig } from 'vitepress'
import italicSmallRenderer from './_italicSmallRenderer'
import llmstxt from 'vitepress-plugin-llms'
import nav from './_nav'
import sidebar from './_sidebar'

const title = 'Kloud Workspace'
const hostname = 'https://ws.kloudkit.com'
const description = '🔋 A batteries included pre-configured development workspace inside a Docker container'

export default defineConfig({
  title,
  description,
  appearance: 'force-dark',
  cleanUrls: true,
  srcDir: './docs',

  sitemap: {
    hostname
  },

  head: [
    ['meta', { name: 'theme-color', content: '#303446' }],
    ['meta', { property: 'og:site_name', content: title }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `${hostname}/logo.png` }],
    ['meta', { property: 'og:image:alt', content: `${title} logo` }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: `${hostname}/logo.png` }],
  ],

  transformHead: ({ pageData }) => {
    const pageTitle = pageData.title
      ? `${pageData.title} | ${title}`
      : title
    const pageDescription =
      pageData.description ||
      pageData.frontmatter.description ||
      description
    const url =
      `${hostname}/` +
      pageData.relativePath.replace(/(index)?\.md$/, '').replace(/\/$/, '')

    return [
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
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
    plugins: [
      llmstxt({
        title,
        description,
        domain: hostname,
        sidebar: configSidebar => configSidebar?.['/'],
        customLLMsTxtTemplate: `# {title}\n\n{description}\n\n## Table of Contents\n\n{toc}\n`
      })
    ],

    server: {
      allowedHosts: true
    }
  }
})
