const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: './src/js/main.jsx'
    },
    output: {
        path: path.resolve(__dirname),
        publicPath: '',
        filename: './dist/js/app.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve(__dirname, './src/js'),
            path.resolve(__dirname, './node_modules'),
            path.resolve(__dirname, './src/scss')
        ],
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: path.resolve(__dirname, './cache'),
                    compact: true
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: ['./src/scss']
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'dist/css/style.css',
            allChunks: true
        }),
        new OfflinePlugin({
            externals: [
                'index.html',
                'dist/css/style.css',
                'assets/fonts/MaterialIcons-Regular.ttf',
                'assets/fonts/Roboto-Regular.ttf'
            ],
            ServiceWorker: {
                events: true
            }
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname),
        host: '0.0.0.0',
        port: 3005,
        disableHostCheck: true
    }
};