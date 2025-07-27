const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

module.exports = function override(config, env) {
  // 添加 Node.js polyfill
  config.plugins.push(
    new NodePolyfillPlugin({
      includeAliases: ['buffer', 'process', 'util', 'stream', 'timers']
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process'
    })
  );
  
  // 添加 fallbacks
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer/"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "process": require.resolve("process/browser"),
    "timers": require.resolve("timers-browserify"),
    "path": require.resolve("path-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "fs": false,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "vm": require.resolve("vm-browserify"),
    "zlib": require.resolve("browserify-zlib")
  };
  
  return config;
}