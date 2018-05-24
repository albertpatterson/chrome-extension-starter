const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');
const run = require('gulp-run');

const port = 3000;
const paths = {
  distDir: "dist",
  srcDir: "src",
  manifestFile: "manifest.json",
  icon: "icon.png"
};

// connects the server at given port and root.
// enables the live reloading.
gulp.task('connect', () => {
  return connect.server({
      livereload: true,
      root: paths.distDir,
      port: port
  });
});

gulp.task('listen', ()=>{
  livereload.listen();
});

gulp.task('connect-and-listen', ()=>{
  runSequence('connect', 'listen');
});

gulp.task('reload', function(){
  livereload.reload();
});

// use gulp-run in the middle of a pipeline:
gulp.task('rebuild', function() {
  return run(`npm run build-dev`).exec();
});

gulp.task('watch', ()=>{
  gulp.watch(["src/**/*"], ['rebuild']);
});