const gulp = require('gulp');
const webpack = require('webpack-stream');
const path = require('path');
const rimraf = require('rimraf');
const gzip = require('gulp-zip');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');
const through = require('through2');
const webpackScriptDevConfig = require('./webpack.script.dev');
const webpackScriptProdConfig = require('./webpack.script.prod');
const webpackPageDevConfig = require('./webpack.page.dev');
const webpackPageProdConfig = require('./webpack.page.prod');

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

function zip() {
  return gulp
    .src(['dist/unpacked/**'])
    .pipe(gzip('extension.zip'))
    .pipe(gulp.dest('dist'));
}

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

function replaceWithJSON(text, search, replacement) {
  const json = JSON.stringify(replacement);
  return text.replace(
    new RegExp(`[\"\']\\*\\*\\* ${search} \\*\\*\\*[\"\']`, 'g'),
    json
  );
}

function copyManifest(isProd) {
  return function copyManifest() {
    const backgroundScripts = isProd
      ? ['background/background.js']
      : ['background/background.js', 'background/chromereload.js'];

    return gulp
      .src('./src/manifest.json')
      .pipe(
        through.obj((chunk, enc, cb) => {
          const trans = chunk.clone();

          const orig = chunk.contents.toString();

          trans.contents = Buffer.from(
            replaceWithJSON(orig, 'Background Scripts', backgroundScripts)
          );

          cb(null, trans);
        })
      )
      .pipe(gulp.dest('dist/unpacked'));
  };
}

function copyIcon() {
  return gulp.src('./src/icon.png').pipe(gulp.dest('dist/unpacked'));
}

function bundleScripts(isProd) {
  const config = isProd ? webpackScriptProdConfig : webpackScriptDevConfig;

  return function bundleScripts() {
    return new Promise((res, rej) => {
      webpack(config)
        .pipe(gulp.dest(`dist/unpacked`))
        .on('end', res)
        .on('error', rej);
    });
  };
}

function bundlePage(isProd) {
  const config = isProd ? webpackPageProdConfig : webpackPageDevConfig;

  return function bundlePage() {
    return new Promise((res, rej) => {
      webpack(config)
        .pipe(gulp.dest(`dist/unpacked`))
        .on('end', res)
        .on('error', rej);
    });
  };
}

const buildDev = gulp.series(
  rmDist,
  gulp.parallel(
    copyIcon,
    copyManifest(false),
    bundleScripts(false),
    bundlePage(false)
  )
);

const buildProd = gulp.series(
  rmDist,
  gulp.parallel(
    copyIcon,
    copyManifest(true),
    bundleScripts(true),
    bundlePage(true)
  )
);

gulp.task('build-dev', buildDev);

function watchForDev() {
  return gulp.watch(['src/**'], gulp.series(buildDev, reload));
}
gulp.task('dev-watch', watchForDev);

gulp.task(
  'dev-watch-reload',
  gulp.parallel(listen, connectServer, watchForDev)
);

gulp.task('build-prod', gulp.series(buildProd, zip));
