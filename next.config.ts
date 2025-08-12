import type { NextConfig } from 'next'

// Allow deploying under a sub-path by configuring basePath/assetPrefix via env
// Example: set NEXT_BASE_PATH=/myapp and NEXT_ASSET_PREFIX=/myapp on the host
const envBasePath = process.env.NEXT_BASE_PATH?.trim()
const envAssetPrefix = process.env.NEXT_ASSET_PREFIX?.trim()

const nextConfig: NextConfig = {
  basePath: envBasePath && envBasePath !== '/' ? envBasePath : undefined,
  assetPrefix:
    envAssetPrefix && envAssetPrefix !== '/' ? envAssetPrefix : undefined,
  reactStrictMode: true,
}

export default nextConfig
