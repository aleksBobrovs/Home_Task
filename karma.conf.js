var webpackConfig = require('./test-webpack.config.js');

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'test/*.spec.ts',
    ],

    exclude: [
    ],

    preprocessors: {
       'test/**/*.spec.ts': ['webpack'],
       'src/**/*.ts': ['webpack'],
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: true,

    concurrency: Infinity,

    mime: {
      'text/x-typescript': ['ts']
    },

    plugins: [
      require("karma-webpack"),
      require("karma-jasmine"),
      require("karma-chrome-launcher")
    ],

    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    }
  })
}
