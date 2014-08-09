'use strict';
var gulp = require('gulp');
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');

gulp.task('clean', function() {
  return gulp.src('build').pipe(plugins.rimraf());
});

gulp.task('build', ['clean'], function() {
  var files = [
    'src/senna.js'
  ];

  return gulp.src(files)
    .pipe(plugins.concat('senna.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(filepath) {
      filepath.basename += '-min';
    }))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('docs', function() {
  return gulp.src(['src/**/*.js', 'README.md'])
    .pipe(plugins.jsdoc('docs'));
});

gulp.task('format', function() {
  return gulp.src('src/**/*.js')
    .pipe(plugins.esformatter())
    .pipe(gulp.dest('src'));
});

gulp.task('lint', function() {
  return gulp.src('src/**/**.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('test', function(cb) {
  gulp.src('test/*.js')
    .pipe(plugins.nodeunit())
    .on('end', cb);
});

gulp.task('test-watch', function() {
  return gulp.watch(['src/**/*.js', 'test/**/*.js'], ['test']);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['build']);
});

// Private helpers
// ===============

function banner() {
  var stamp = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n');

  return plugins.header(stamp, {
    pkg: pkg
  });
}
