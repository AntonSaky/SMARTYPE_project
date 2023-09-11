const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'develovpment',
    entry: ['./js/index.js', './js/firestore.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'www'),
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    devServer: {
        port: 3003,
    },
    resolve: {
        fallback: { 
            path: false,
            crypto: false
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'img'),
                    to: path.resolve(__dirname, 'www/img'),
                },
            ]
            
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new CleanWebpackPlugin(),
        
        new MiniCssExtractPlugin({
            filename: 'css/style.css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader'],
            },
            {
                test: /\.(webp|png|jpg|gif|ico|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            }
        ]
    }
        
    
}
