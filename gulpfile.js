const gulp = require('gulp');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');
const run = require('gulp-run');
const gzip = require('gulp-zip');

const port = 3000;
const paths = {
  distDir: "dist/unpacked",
  srcDir: "src",
  manifestFile: "manifest.json",
  icon: "icon.png"
};

// connects the server at given port and root.
// enables the live reloading.
gulp.task('connect', done => {
  connect.server({
      livereload: true,
      root: paths.distDir,
      port: port
  });
  done();
});

gulp.task('listen', done => {
  livereload.listen(done);
});


gulp.task('connect-and-listen', gulp.series('connect', 'listen'));

gulp.task('reload', done => {
  livereload.reload();
  done();
});

// use gulp-run in the middle of a pipeline:
gulp.task('rebuild', function() {
  return run(`npm run build-dev`).exec();
});

gulp.task('watch', ()=>{
  return gulp.watch(["src/**/*"], gulp.series('rebuild'));
});

gulp.task('zip', function(){
  return gulp.src(['dist/unpacked/**'])
    .pipe(gzip('extension.zip'))
    .pipe(gulp.dest('dist'))
})