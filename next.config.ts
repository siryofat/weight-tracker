import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add Clerk's public routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sign-up/:path*",
          destination: "/sign-up",
        },
        {
          source: "/sign-in/:path*",
          destination: "/sign-in",
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
