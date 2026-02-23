const contribute = [
  {
    text: 'Get Involved',
    items: [
      { text: 'Contribute', link: '/contribute/' },
      { text: 'Code of Conduct', link: '/contribute/code-of-conduct' },
      { text: 'Workflow', link: '/contribute/contribution-workflow' },
      { text: 'Development Environment', link: '/contribute/development-environment' },
      { text: 'Security Advisory', link: '/contribute/security-advisory' },
    ]
  },
  {
    text: '← Back to Docs',
    link: '/pages',
  }
]

export default {
  '/contribute/': contribute,
  '/': [
    { text: 'Introduction', link: '/pages' },
    { text: 'Getting Started', link: '/pages/getting-started' },
    {
      text: 'Get Involved',
      collapsed: true,
      items: [
        { text: 'Contribute', link: '/contribute/' },
      ]
    },
    {
      text: 'Editor',
      items: [
        { text: 'Aliases', link: '/editor/aliases' },
        { text: 'Authentication', link: '/editor/authentication' },
        { text: 'Extensions', link: '/editor/extensions' },
        { text: 'Features', link: '/editor/features' },
        { text: 'Port Forwarding', link: '/editor/port-forwarding' },
        { text: 'Settings', link: '/editor/settings' },
        { text: 'Storage', link: '/editor/storage' },
        { text: 'Terminal', link: '/editor/terminal' },
        { text: 'Theme & Fonts', link: '/editor/theme-and-fonts' },
      ]
    },
    {
      text: 'Settings',
      items: [
        { text: 'Autoload Scripts', link: '/settings/autoload-scripts' },
        { text: 'Configuration', link: '/settings/configuration' },
        { text: 'TLS & Certificates', link: '/settings/tls' },
        { text: 'Secrets', link: '/settings/secrets' },
        { text: 'Vault', link: '/settings/vault' },
      ]
    },
    {
      text: 'Tools',
      items: [
        { text: 'Overview', link: '/tools/overview' },
        { text: 'Ansible', link: '/tools/ansible' },
        { text: 'APT', link: '/tools/apt' },
        { text: 'Docker', link: '/tools/docker' },
        { text: 'Git', link: '/tools/git' },
        { text: 'Go', link: '/tools/go' },
        { text: 'Helm', link: '/tools/helm' },
        { text: 'Kind', link: '/tools/kind' },
        { text: 'Python', link: '/tools/python' },
        { text: 'Rust', link: '/tools/rust' },
        { text: 'SSH', link: '/tools/ssh' },
        { text: 'ws-cli', link: '/tools/ws-cli' },
      ]
    }
  ]
}
