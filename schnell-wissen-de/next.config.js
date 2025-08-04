/** @type {import('next').NextConfig} */

// GitHub Pages deployment configuration
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const repoName = 'artikel-webseite' // Ersetzen Sie mit Ihrem Repository-Namen

const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Skip build for admin pages with dynamic routes
  generateBuildId: () => 'build-' + Date.now(),
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure base path for GitHub Pages
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  
  // Ensure trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
  
  // Disable server-side features for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure for static export
  distDir: 'out',
  
  // Environment variables available to the client
  env: {
    CUSTOM_BASE_PATH: isGithubPages ? `/${repoName}` : '',
  },
  
  // Remove experimental features for Next.js 15
  
  // Webpack configuration for static assets
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  // Note: redirects and headers don't work with static export
}

module.exports = nextConfig