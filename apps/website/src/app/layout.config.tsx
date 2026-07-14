import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: 'Rooks',
    url: '/docs',
  },
  githubUrl: 'https://github.com/imbhargav5/rooks',
  links: [
    {
      text: 'npm',
      url: 'https://www.npmjs.com/package/rooks',
      external: true,
    },
    {
      text: 'Changelog',
      url: 'https://github.com/imbhargav5/rooks/blob/main/packages/rooks/CHANGELOG.md',
      external: true,
    },
    {
      type: 'menu',
      text: 'Community',
      items: [
        {
          text: 'Contributing',
          description: 'Set up the repository and propose a change.',
          url: 'https://github.com/imbhargav5/rooks/blob/main/CONTRIBUTING.md',
          external: true,
        },
        {
          text: 'Support',
          description: 'Choose the right place for questions and bug reports.',
          url: 'https://github.com/imbhargav5/rooks/blob/main/SUPPORT.md',
          external: true,
        },
        {
          text: 'Security',
          description: 'Report vulnerabilities privately.',
          url: 'https://github.com/imbhargav5/rooks/blob/main/SECURITY.md',
          external: true,
        },
        {
          text: 'Maintenance',
          description: 'Run releases and recover partial publication failures.',
          url: 'https://github.com/imbhargav5/rooks/blob/main/MAINTENANCE.md',
          external: true,
        },
      ],
    },
  ],
};
