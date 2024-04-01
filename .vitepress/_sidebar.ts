export default [
  { text: 'Introduction', link: '/pages' },
  { text: 'Getting Started', link: '/pages/getting-started' },
  {
    text: 'Editor',
    items: [
      { text: 'Authentication', link: '/editor/authentication'},
      { text: 'Extensions', link: '/editor/extensions'},
      { text: 'Extra Features', link: '/editor/features'},
      { text: 'Settings', link: '/editor/settings'},
      { text: 'Theme & Fonts', link: '/editor/theme-and-fonts'},
      { text: 'Terminal', link: '/editor/terminal'},
    ]
  },
  {
    text: 'Settings',
    items: [
      { text: 'Autoload Scripts', link: '/pages/autoload-scripts' },
      { text: 'Environment Variables', link: '/pages/environment-variables' },
      { text: 'Enterprise CA', link: '/pages/enterprise-ca' },
      { text: 'Secret Injection', link: '/pages/secrets' },
    ]
  },

  {
    text: 'Tools',
    items: [
      { text: 'docker', link: '/tools/docker' },
      { text: 'git', link: '/tools/git' },
      { text: 'ssh', link: '/tools/ssh' },
      { text: 'ws-cli', link: '/tools/ws-cli' },
    ]
  }
]
