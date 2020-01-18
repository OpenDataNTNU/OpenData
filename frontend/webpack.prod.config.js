const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'production',
  entry: path.join(__dirname, '/src/index.jsx'),
  output: {
    path: path.resolve(__dirname, '/public'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
  ],
  optimization: {
    namedModules: false,
    namedChunks: false,
    nodeEnv: 'production',
    flagIncludedChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    noEmitOnErrors: true,
    checkWasmTypes: true,
    minimize: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg', '.gif'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
            plugins: [
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-object-rest-spread'),
              require('@babel/plugin-transform-destructuring'),
              require('@babel/plugin-proposal-function-bind'),
            ],
          },
        },
      },
      {
        test: /\.(png|jp(e*)g|svg|gif|ttf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: '/images/[hash]-[name].[ext]',
          },
        }],
      },
    ],
  },
};
module.exports = config;
