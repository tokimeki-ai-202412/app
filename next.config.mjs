import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import createMDX from '@next/mdx';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
