import { defineConfig }   from 'vitepress'
import markdownItFootnote from 'markdown-it-footnote'
import dockerSVG          from './_dockerSVG'
import nav                from './_nav'
import sidebar            from './_sidebar'


export default defineConfig({
  title: 'Kloud Workspace',
  description: '🔋 A batteries included pre-configured development workspace',
  cleanUrls: true,
  srcDir: './docs',

  themeConfig: {
    nav,
    sidebar,

    logo: '/favicon.ico',

    search: { provider: 'local' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kloudkit/workspace' },
      { icon: { svg: dockerSVG }, link: 'https://github.com/kloudkit/workspace/pkgs/container/workspace' }
    ],

    editLink: {
      pattern: 'https://github.com/kloudkit/workspace-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright &copy; ${new Date().getFullYear()} KloudKIT`
    },
  },

  markdown: {
    config: md => {
      md.use(markdownItFootnote)
    },
    theme: 'catppuccin-frappe'
  }
})
