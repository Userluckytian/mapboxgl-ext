const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    entry: {
        // polyfill: 'babel-polyfill',
        'cityfun.min': './src/main.js',
        test: './src/test.js',
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        library: 'cityfun',
        libraryExport: 'default',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [{
                test: /\.css$/,

                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader',
                ],
            },

            {
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader',
                    'less-loader',
                ],
            },

            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',

                    options: {
                        limit: 8 * 1024,

                        name: '[name].[ext]',

                        publicPath: '../images/',

                        outputPath: 'images/',
                    },
                }, ],
            },

            {
                test: /\.js$/,

                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                },
            },

            // {
            // 	test: /\.vue$/,
            // 	loader: 'vue-loader',
            // },
        ],
    },

    // 配置插件
    plugins: [
        // new HtmlWebpackPlugin({ template: './index.html' }),

        new MiniCssExtractPlugin({
            filename: 'cityfun.min.css',
        }),

        // new CleanWebpackPlugin(),

        // new VueLoaderPlugin(),
    ],
};