module.exports = {
    proxyTable: {
        '/api': {
            target: 'http://localhost:8090',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    }
}