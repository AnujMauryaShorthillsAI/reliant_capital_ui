const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/company/add',
    createProxyMiddleware({
      target: 'http://20.150.214.47:8000',
      changeOrigin: true,
    })
  );

  app.use(
    '/api/v1/companies',
    createProxyMiddleware({
      target: 'https://webapp.forecasa.com',
      changeOrigin: true,
    })
  );

  app.use(
    '/api/v1/geo/counties_by_states',
    createProxyMiddleware({
      target: 'https://webapp.forecasa.com',
      changeOrigin: true,
    })
  );
};