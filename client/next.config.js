/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/nextviewer'
}

module.exports = nextConfig
/*module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'http://localhost:8081/:path/',
        },
      ]
    },
  } */