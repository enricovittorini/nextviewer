/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/nextviewer',
 // output: 'export',
  
    async rewrites() {
 
      return [
        {
          source: '/nextviewer/:path*',
          destination: 'http://localhost:8081/:path*/',
        },
        {
          source: '/:path*',
          destination: 'http://localhost:8081/nextviewer/:path*/',
        },
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