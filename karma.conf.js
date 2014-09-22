module.exports = function(config) {
  'use strict';

  var configuration = {
    frameworks: ['mocha'],
    files: [
        'bower_components/mocha/mocha.css',
        'src/senna.js',
        'src/utils/EventEmitter.js',
        'src/utils/Cacheable.js',
        'src/utils/DataAttributeHandler.js',
        'src/app/App.js',
        'src/route/Route.js',
        'src/surface/Surface.js',
        'src/screen/Screen.js',
        'src/screen/RequestScreen.js',
        'src/screen/HtmlScreen.js',
        'src/vendor/Promise.js',
        'bower_components/assert/assert.js',
        'bower_components/mocha/mocha.js',
        'test/fixture/util.js',
        'test/test.js',
        {
          pattern: 'test/fixture/*',
          included: false,
          served: true
        }
    ],
    proxies: {
      '/fixture': '/base/test/fixture'
    },
    preprocessors: {
      'src/!(vendor)/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    browsers: ['Chrome', 'Firefox', 'Safari']
  };

  if (process.env.TRAVIS) {
    configuration.customLaunchers = {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };

    configuration.browsers = ['Firefox', 'Chrome_travis_ci'];
  }

  config.set(configuration);
};
