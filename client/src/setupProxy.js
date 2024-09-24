const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:4000', // Where the API server is hosted
    changeOrigin: true, // Needed for virtual hosted sites
  }));
};