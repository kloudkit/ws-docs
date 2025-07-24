export default [
  { text: 'Introduction', link: '/pages' },
  { text: 'Getting Started', link: '/pages/getting-started' },
  {
    text: 'Get Involved',
    collapsed: true,
    items: [
      { text: 'Contribute', link: '/contribute/' },
      { text: 'Code of Conduct', link: '/contribute/code-of-conduct' },
      { text: 'Workflow', link: '/contribute/contribution-workflow' },
      { text: 'Development Environment', link: '/contribute/development-environment' },
      { text: 'Security Advisory', link: '/contribute/security-advisory' }
    ]
  },
  {
    text: 'Editor',
    items: [
      { text: 'Authentication', link: '/editor/authentication'},
      { text: 'Aliases', link: '/editor/aliases'},
      { text: 'Extensions', link: '/editor/extensions'},
      { text: 'Extra Features', link: '/editor/features'},
      { text: 'Port Forwarding', link: '/editor/port-forwarding'},
      { text: 'Settings', link: '/editor/settings'},
      { text: 'Storage', link: '/editor/storage'},
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
    text: 'Tools &mdash; Overview',
    link: '/tools',
    items: [
      { text: 'ansible', link: '/tools/ansible' },
      { text: 'apt', link: '/tools/apt' },
      { text: 'docker', link: '/tools/docker' },
      { text: 'git', link: '/tools/git' },
      { text: 'go', link: '/tools/go' },
      { text: 'helm', link: '/tools/helm' },
      { text: 'kind', link: '/tools/kind' },
      { text: 'python', link: '/tools/python' },
      { text: 'rust', link: '/tools/rust' },
      { text: 'ssh', link: '/tools/ssh' },
      { text: 'ws-cli', link: '/tools/ws-cli' },
    ]
  }
]
