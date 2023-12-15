const path=require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions:{
    includePaths:[path.join(__dirname,'style')],
  },
  basePath: '/nextviewer',
  output: 'export',
  
    //  async rewrites() {
 
    //   return [
    //     {
    //       source: '/nextviewer/:path*',
    //       destination: 'http://localhost:8081/:path*/',
    //     },
    //     {
    //       source: '/:path*',
    //       destination: 'http://localhost:8081/nextviewer/:path*/',
    //     },
    //   ]
    
    // },

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