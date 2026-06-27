const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Миры Двуликого',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    host: '0.0.0.0',
    port: 443,
    hot: true,
    https: {
      key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
      cert: fs.readFileSync(path.join(__dirname, 'ssl/server.crt')),
    },
    open: false,
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
  resolve: {
    alias: {
      '@js': path.resolve(__dirname, 'src/js'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  performance: {
    hints: false,
  },
};
