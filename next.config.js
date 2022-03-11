
module.exports = {
  env: {
    STRIPE_PK_KEY: process.env.STRIPE_PK_KEY,
    GOOGLE_KEY: process.env.GOOGLE_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://d2u0unnpqhu2n5.cloudfront.net/api/:path*' // Proxy to Backend
      },
      {
        source: '/images/:path*',
        destination: 'https://d2u0unnpqhu2n5.cloudfront.net/images/:path*' // Proxy to Images
      }
    ]
  }
};