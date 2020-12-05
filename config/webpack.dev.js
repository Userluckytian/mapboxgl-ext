const base = require('./webpack.base.js');
const merge = require('webpack-merge');
module.exports = merge(base, {
    mode: 'development', //   mode: 'production' , //development
    devServer: {
        port: 4000,
        host: '127.0.0.1',
        // open: true
    },
});