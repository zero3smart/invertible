const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv').config();

module.exports = {
  devtool: 'inline-sourcemap',
  entry: [
    path.join(__dirname, '/src/index.js')
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    hot: true,
    inline: true,
    historyApiFallback: true,
    contentBase: [
      path.join(__dirname, '/src/assets'),
      path.join(__dirname, '/src/components'),
      path.join(__dirname, '/node_modules')
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Invertible',
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body',
      favicon: 'public/favicon.ico',
      hash: true,
      cache: true
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL)
      }
    })
    /*,
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })*/
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.join(__dirname, 'src'),
        ],
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        include: [
          /node_modules/
        ],
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(scss|sass)$/,
        include: [
          path.join(__dirname, 'src'),
        ],
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /.*\.(gif|png|jpe?g|eot|woff2|woff|ttf|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
            },
          },
        ]
      },
      {
        test: /\.tsv$/,
        include: [
          path.join(__dirname, 'src/data')
        ],
        loaders: ["dsv-loader"]
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
      alias: {
        'react-d3-map-choropleth.css': path.join(__dirname, '../node_modules/react-d3-map-choropleth/css/react-d3-map-choropleth.css')
       }
  },
  node: {
    net: 'empty',
    dns: 'empty',
    fs: 'empty'
  }
}
