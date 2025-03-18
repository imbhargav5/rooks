import { withContentCollections } from '@content-collections/next';
import { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs',
        permanent: false,
      },
    ];
  },
};

export default withContentCollections(config);
