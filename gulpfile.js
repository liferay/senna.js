'use strict';

var gulp = require('gulp');
var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'senna.css',
	bundleFileName: 'senna.js',
	globalName: 'senna',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'senna'
});

gulp.task('default', ['build:globals', 'build:amd']);