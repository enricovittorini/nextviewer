/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/nextviewer',
  output: 'export',

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://localhost:8081/:path*/',
      }
    ]
  },


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