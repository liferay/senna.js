'use strict';

var connect = require('gulp-connect');
var gulp = require('gulp');
var header = require('gulp-header');
var jsdoc = require('gulp-jsdoc3');
var metal = require('gulp-metal');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var stripDebug = require('gulp-strip-debug');

// Metal -----------------------------------------------------------------------

metal.registerTasks({
	bundleCssFileName: 'senna.css',
	bundleFileName: 'senna.js',
	globalName: 'senna',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'senna',
	noSoy: true,
	testBrowsers: ['Chrome', 'Firefox', 'Safari', 'IE10 - Win7', 'IE11 - Win7'],
	testSaucelabsBrowsers: {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome'
		},
		sl_safari_8: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '8'
		},
		sl_safari_9: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '9'
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox'
		},
		sl_ie_10: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '10'
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11'
		},
		sl_edge_20: {
			base: 'SauceLabs',
			browserName: 'microsoftedge',
			platform: 'Windows 10',
			version: '13'
		},
		sl_iphone: {
			base: 'SauceLabs',
			browserName: 'iphone',
			platform: 'OS X 10.10',
			version: '9.2'
		},
		sl_android_4: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '4.4'
		},
		sl_android_5: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '5.0'
		}
	}
});

// Helpers ---------------------------------------------------------------------

gulp.task('banner', function() {
	var stamp = [
		'/**',
		' * Senna.js - <%= description %>',
		' * @author Liferay, Inc.',
		' * @version v<%= version %>',
		' * @link http://sennajs.com',
		' * @license BSD-3-Clause',
		' */',
		''
	].join('\n');

	return gulp.src('build/globals/*.js')
		.pipe(header(stamp, require('./package.json')))
		.pipe(gulp.dest('build/globals'));
});

gulp.task('clean:debug', function() {
	return gulp.src('build/globals/senna.js')
		.pipe(rename('senna-debug.js'))
		.pipe(gulp.dest('build/globals'));
});

gulp.task('clean:debug:globals', function() {
	return gulp.src('build/globals/senna.js')
		.pipe(stripDebug())
		.pipe(gulp.dest('build/globals'));
});

gulp.task('clean:debug:amd', function() {
	return gulp.src('build/amd/senna/**/*.js')
		.pipe(stripDebug())
		.pipe(gulp.dest('build/amd/senna'));
});

gulp.task('docs', function() {
	return gulp.src(['src/**/*.js', 'README.md'])
		.pipe(jsdoc({
			opts: {
				destination: 'docs'
			}
		}));
});

// Runner ----------------------------------------------------------------------

gulp.task('default', function(done) {
	runSequence('clean', 'css', 'build:globals', 'uglify', 'build:amd', 'banner', 'clean:debug', 'clean:debug:globals', 'clean:debug:amd', done);
});

gulp.task('server', ['default'], function() {
	connect.server({
		port: 8888
	});
});
