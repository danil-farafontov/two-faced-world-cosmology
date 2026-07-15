const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    oop: './src/js/main.js',
    procedural: './src/js-procedural/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/bundle.[contenthash].js',
    clean: true,
    assetModuleFilename: '[name]/assets/[hash][ext][query]',
    publicPath: process.env.NODE_ENV === 'production'
      ? '/two-faced-world-cosmology/'
      : '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
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
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['src/scss'],
              },
            },
          },
        ],
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
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index-oop.html',
      filename: 'index.html', // <--- duplicate index.html for github pages
      title: 'Миры Двуликого (ООП)',
      chunks: ['oop'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index-oop.html',
      filename: 'oop/index.html',
      title: 'Миры Двуликого (ООП)',
      chunks: ['oop'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index-procedural.html',
      filename: 'procedural/index.html',
      title: 'Миры Двуликого (Procedural)',
      chunks: ['procedural'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/style.[contenthash].css',
    }),
  ],
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: {
        rewrites: [{ from: /^\/$/, to: '/oop/' }]
    },
    /*static: {
      directory: path.join(__dirname, 'public'),
    },*/
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
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@js': path.resolve(__dirname, 'src/js'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@css': path.resolve(__dirname, 'src/css-procedural'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
  performance: {
    hints: false,
  },
};
