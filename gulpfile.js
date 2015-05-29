'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var karma = require('karma').server;
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var stylish = require('jshint-stylish');

var mainFiles = [
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
  'src/vendor/Promise.js'
];

gulp.task('init', function() {
  return bower();
});

gulp.task('build', ['clean'], function() {
  return runSequence('build-raw', 'build-min', 'build-debug', 'build-css');
});

gulp.task('build-css', function() {
  return gulp.src('src/senna.css')
    .pipe(plugins.csso())
    .pipe(plugins.autoprefixer('last 3 version'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-raw', function() {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('senna.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-min', function() {
  return gulp.src(mainFiles)
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.concat('senna-min.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-debug', function() {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('senna-debug.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return gulp.src('build').pipe(plugins.rimraf());
});

gulp.task('docs', function() {
  return gulp.src(['src/**/*.js', 'README.md'])
    .pipe(plugins.jsdoc('docs'));
});

gulp.task('format', function() {
  return gulp.src(['src/**/*.js', '!src/vendor/Promise.js'])
    .pipe(plugins.esformatter())
    .pipe(gulp.dest('src'));
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', '!src/vendor/Promise.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('serve', function() {
  return gulp.src('./')
    .pipe(plugins.webserver({
      directoryListing: true,
      open: true
    }));
});

gulp.task('watch', ['build', 'serve'], function() {
  gulp.watch('src/**/*', ['build']);
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-watch', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// Private helpers
// ===============

function banner() {
  var stamp = [
    '/**',
    ' * Senna.js - <%= pkg.description %>',
    ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' * @version v<%= pkg.version %>',
    ' * @link http://sennajs.com',
    ' * @license BSD',
    ' */',
    ''
  ].join('\n');

  return plugins.header(stamp, {
    pkg: pkg
  });
}
