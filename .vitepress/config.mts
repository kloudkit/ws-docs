import { defineConfig, type HeadConfig } from 'vitepress'
import italicSmallRenderer from './_italicSmallRenderer'
import llmstxt from 'vitepress-plugin-llms'
import nav from './_nav'
import sidebar from './_sidebar'

const title = 'Kloud Workspace'
const hostname = 'https://ws.kloudkit.com'
const description = '🔋 A batteries-included pre-configured development workspace inside a Docker container'

const publisher = {
  '@type': 'Organization',
  name: 'KloudKIT',
  url: 'https://github.com/kloudkit',
  logo: `${hostname}/logo.png`,
}

const website = {
  '@type': 'WebSite',
  name: title,
  url: `${hostname}/`,
  publisher,
}

export default defineConfig({
  title,
  description,
  appearance: 'force-dark',
  cleanUrls: true,
  lastUpdated: true,
  srcDir: './docs',
  srcExclude: ['partials/**'],

  sitemap: {
    hostname
  },

  head: [
    ['meta', { name: 'theme-color', content: '#303446' }],
    ['meta', { property: 'og:site_name', content: title }],
    ['meta', { property: 'og:image', content: `${hostname}/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { property: 'og:image:alt', content: `${title} — configured development by KloudKIT` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${hostname}/og-image.png` }],
  ],

  transformHead: ({ pageData }) => {
    const isHome = pageData.relativePath === 'index.md'
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
    const modified = pageData.lastUpdated
      ? new Date(pageData.lastUpdated).toISOString()
      : undefined

    const head: HeadConfig[] = [
      ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['link', { rel: 'canonical', href: url }],
      ['script', { type: 'application/ld+json' }, JSON.stringify(
        isHome
          ? [
              { ...website, '@context': 'https://schema.org' },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: title,
                description,
                url: `${hostname}/`,
                image: `${hostname}/og-image.png`,
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Linux (Docker)',
                license: 'https://opensource.org/licenses/MIT',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                sameAs: [
                  'https://github.com/kloudkit/ws-meta',
                  'https://github.com/orgs/kloudkit/packages/container/package/workspace',
                ],
                publisher,
              },
            ]
          : {
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              headline: pageData.title || title,
              description: pageDescription,
              url,
              image: `${hostname}/og-image.png`,
              ...(modified && { dateModified: modified }),
              isPartOf: website,
              publisher,
            }
      )],
    ]

    if (modified && !isHome) {
      head.push(['meta', { property: 'article:modified_time', content: modified }])
    }

    return head
  },

  themeConfig: {
    nav,
    sidebar,

    logo: '/logo-nav.svg',

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
