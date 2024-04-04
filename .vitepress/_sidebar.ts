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
      { text: 'Autoload Scripts', link: '/settings/autoload-scripts' },
      { text: 'Environment Variables', link: '/settings/environment-variables' },
      { text: 'Enterprise CA', link: '/settings/enterprise-ca' },
      { text: 'Secret Injection', link: '/settings/secrets' },
    ]
  },

  {
    text: 'Tools',
    link: '/tools',
    items: [
      { text: 'docker', link: '/tools/docker' },
      { text: 'git', link: '/tools/git' },
      { text: 'ssh', link: '/tools/ssh' },
      { text: 'ws-cli', link: '/tools/ws-cli' },
    ]
  }
]
