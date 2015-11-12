var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync');
var reload = bs.reload;
var shell = require('gulp-shell');

var paths = {
  scripts: ['client/**/*.js'],
  html: ['client/**/*.html'],
  styles: ['client/**/*.css']
}
gulp.task('start', ['serve'],function () {
  bs({
    notify: true,
    // address for server,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:8000'
  });
});

gulp.task('serve', function() {
  nodemon({script: './server/index.js', ignore: 'node_modules/**/*.js'});
});