const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack.bundle.js',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: '/index.html' }),
        new Dotenv({ path: path.resolve(__dirname, '.env') }),
        new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'public'), 
                to: 'public',  
              },
              {
                from: path.resolve(__dirname, 'index.css'), 
                to: 'index.css',  
              },
            ],
          }),
    ],
  };