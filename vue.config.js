module.exports = {
    devServer: {
        // This will forward any request that does not match a static file
        // to localhost:8090
        proxy: 'http://localhost:8090',
        host: 'localhost'
    },

    transpileDependencies: [
      'vuetify'
    ]
}
