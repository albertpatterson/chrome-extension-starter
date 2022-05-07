const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackProdConfig = require('./webpack.prod');
const webpackDevConfig = require('./webpack.dev');
const path = require('path');
const rimraf = require('rimraf');
const gzip = require('gulp-zip');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');

const DIST_PATH = path.resolve(__dirname, 'dist');

function rmDir(dirPath) {
  return new Promise((res, rej) => {
    rimraf(dirPath, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

async function rmDist() {
  await rmDir(DIST_PATH);
}

function bundle(config) {
  return new Promise((res, rej) =>
    webpack(config)
      .pipe(gulp.dest(`dist/unpacked`))
      .on('end', res)
      .on('error', rej)
  );
}

function bundleProd() {
  return bundle(webpackProdConfig);
}

function bundleDev() {
  return bundle(webpackDevConfig);
}

function createLogger(msg) {
  return async function () {
    console.log(msg);
  };
}

function zip() {
  return gulp
    .src(['dist/unpacked/**'])
    .pipe(gzip('extension.zip'))
    .pipe(gulp.dest('dist'));
}

gulp.task('build prod', gulp.series(rmDist, bundleProd, zip));

// connects the server at given port and root.
// enables the live reloading.
function connectServer() {
  return connect.server({
    livereload: true,
    root: 'dist/unpacked',
    port: 35729,
  });
}

function listen(done) {
  livereload.listen({}, done);
}

function reload(done) {
  livereload.reload();
  done();
}

gulp.task('dev', gulp.series(rmDist, bundleDev));

gulp.task('dev-watch', () =>
  gulp.watch(['src/**'], gulp.series(rmDist, bundleDev))
);

gulp.task('dev-watch-reload', () =>
  gulp.watch(['src/**'], gulp.series(rmDist, bundleDev, reload))
);

gulp.task('listen-for-reload', gulp.series(listen, connectServer));
