const fs = require('fs');
module.exports = {
    publicPath: '/novel/',
    devServer: {
        proxy: {
            '/api': {
                target: "http://localhost:8092/", // API服务所在IP及端口号
                changeOrigin: true, // 如果设置为true,那么本地会虚拟一个服务器接收你的请求并代你发送该请求，这样就不会有跨域问题（只适合开发环境）
                pathRewrite: {
                    '^/api': '' // 重写路径
                },
            },
            '/img': {
                target: "http://localhost:8092/img", // API服务所在IP及端口号
                changeOrigin: true, // 如果设置为true,那么本地会虚拟一个服务器接收你的请求并代你发送该请求，这样就不会有跨域问题（只适合开发环境）
                pathRewrite: {
                    '^/img': '' // 重写路径
                },
            }
        },
        // public: '100.72.181.60:8080/readOnline/',
        // hot: true,
        disableHostCheck: true,
    }
}