var gulp = require( 'gulp' );
var mocha = require( 'gulp-mocha' );
var jshint = require( 'gulp-mocha' );

gulp.task( 'test', function( ) {
  return gulp.src( './tests/unit/*-test.js' )
             .pipe( mocha() );
});