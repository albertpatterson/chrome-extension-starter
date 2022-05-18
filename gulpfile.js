const gulp = require('gulp');
const webpack = require('webpack-stream');
const path = require('path');
const rimraf = require('rimraf');
const gzip = require('gulp-zip');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');
const webpackScriptDevConfig = require('./webpack/webpack.script.dev');
const webpackScriptProdConfig = require('./webpack/webpack.script.prod');
const webpackPageDevConfig = require('./webpack/webpack.page.dev');
const webpackPageProdConfig = require('./webpack/webpack.page.prod');
const DIST_PATH = path.resolve(__dirname, 'dist');
const through2 = require('through2');
const fs = require('fs');

const INJECTED_SCRIPT_DIR = path.resolve(__dirname, 'src', 'injected');
const BACKGROUND_PROD_FILES_DIR = path.resolve(__dirname, 'src', 'background');
const BACKGROUND_EXTRA_DEV_FILES_DIR = path.resolve(
  BACKGROUND_PROD_FILES_DIR,
  'dev_mode_only'
);
const ICON_DIR = path.resolve(__dirname, 'src', 'icon');

async function readdirFull(dir, filesOnly) {
  const allContents = await fs.promises.readdir(dir);

  const allFullPaths = allContents.map((file) => path.resolve(dir, file));

  if (filesOnly) {
    const fullPathDirTests = await Promise.all(
      allFullPaths.map(async (fullPath) => {
        const stats = await fs.promises.stat(fullPath);
        return { fullPath, isDir: stats.isDirectory() };
      })
    );

    const files = [];
    for (const fullPathDirTest of fullPathDirTests) {
      if (!fullPathDirTest.isDir) {
        files.push(fullPathDirTest.fullPath);
      }
    }
    return files;
  }

  return allFullPaths;
}

function taskToPromise(task) {
  return new Promise((res, rej) => task.on('end', res).on('error', rej));
}

async function runTasks(tasks, parallel) {
  if (parallel) {
    const promises = tasks.map(taskToPromise);
    await Promise.all(promises);
  } else {
    for (const task of tasks) {
      await taskToPromise(task);
    }
  }
}

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

function copyManifest(isProd) {
  const devPermissions = ['alarms'];

  return function copyManifest() {
    return gulp
      .src('./src/manifest.json')
      .pipe(
        through2.obj((chunk, enc, callback) => {
          const trans = chunk.clone();

          const manifest = JSON.parse(trans.contents.toString());
          const prodPermissions = manifest.permissions || [];
          const permissions = isProd
            ? prodPermissions
            : Array.from(new Set([...prodPermissions, ...devPermissions]));
          manifest.permissions = permissions;

          trans.contents = Buffer.from(JSON.stringify(manifest));

          callback(null, trans);
        })
      )
      .pipe(gulp.dest('dist/unpacked'));
  };
}

async function copyIcons() {
  // return async function copyIcons() {
  const srcs = await readdirFull(ICON_DIR, true);

  const tasks = srcs.map((src) => {
    const filename = path.basename(src);

    return gulp.src(src).pipe(gulp.dest('dist/unpacked/icon'));
  });

  await runTasks(tasks, true);
  // };
}

function copyRootArtifacts(isProd) {
  return gulp.parallel(copyIcons, copyManifest(isProd));
}

const EXTRA_DEV_FILES = [
  './src/background/dev_mode_only/chromereload.ts',
  './src/background/dev_mode_only/keep_active.ts',
];

const bundleServiceWorker = (isProd) => {
  return async function bundleServiceWorker() {
    const srcs = await readdirFull(BACKGROUND_PROD_FILES_DIR, true);

    if (!isProd) {
      const extraDevFiles = await readdirFull(
        BACKGROUND_EXTRA_DEV_FILES_DIR,
        true
      );

      srcs.push(...extraDevFiles);
    }

    const config = isProd ? webpackScriptProdConfig : webpackScriptDevConfig;

    return taskToPromise(
      gulp
        .src(srcs)
        .pipe(
          webpack({
            ...config,
            output: {
              filename: 'service_worker.js',
            },
          })
        )
        .pipe(gulp.dest('dist/unpacked/background'))
    );
  };
};

const bundleInjected = (isProd) => {
  const config = isProd ? webpackScriptProdConfig : webpackScriptDevConfig;

  return async function bundleInjected() {
    const srcs = await readdirFull(INJECTED_SCRIPT_DIR, true);

    const tasks = srcs.map((src) => {
      const filename = path.basename(src, 'ts') + 'js';

      return gulp
        .src(src)
        .pipe(
          webpack({
            ...config,
            output: {
              filename,
            },
          })
        )
        .pipe(gulp.dest('dist/unpacked/injected'));
    });

    await runTasks(tasks, true);
  };
};

function bundleScripts(isProd) {
  return gulp.parallel(bundleServiceWorker(isProd), bundleInjected(isProd));
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
    copyRootArtifacts(false),
    bundleScripts(false),
    bundlePage(false)
  )
);

const buildProd = gulp.series(
  rmDist,
  gulp.parallel(copyRootArtifacts(true), bundleScripts(true), bundlePage(true))
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
