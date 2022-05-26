import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import chalk from 'chalk';
import webpack from 'webpack';
import archiver from 'archiver';
import ncp from 'ncp';

export async function copyFile(src, dest) {
  await assertParentDir(dest);
  await fs.promises.copyFile(src, dest);
}

export async function copyDir(src, dest) {
  await assertParentDir(dest);
  await ncp(src, dest);
}

export async function transformFile(src, dest, transform) {
  const contents = await fs.promises.readFile(src);
  const transformed = transform(contents);
  await assertParentDir(dest);
  await fs.promises.writeFile(dest, transformed);
}

async function assertDir(dir) {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function assertParentDir(file) {
  const parent = path.dirname(file);
  await assertDir(parent);
}

export async function rmrf(path) {
  await new Promise((res, rej) => {
    rimraf(path, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

async function runAndReport(task) {
  const start = Date.now();
  const taskName = task.name;
  const doLog = !['runParallelTasks', 'runSeriesTasks'].includes(taskName);
  if (doLog) {
    console.log(chalk.bgHex('#d6e9ff')(`start\t${task.name}`));
  }
  await task();
  if (doLog) {
    console.log(
      chalk.bgHex('#dcffdc')(`finish\t${task.name} in ${Date.now() - start}ms`)
    );
  }
}

export function series(tasks) {
  return async function runSeriesTasks() {
    for (const task of tasks) {
      await runAndReport(task);
    }
  };
}

export function parallel(tasks) {
  return async function runParallelTasks() {
    await Promise.all(tasks.map((task) => runAndReport(task)));
  };
}

const webpackAsyncRaw = async (config) =>
  new Promise((res, rej) => {
    webpack(config, (err, stats) => {
      if (err) {
        rej(err);
        return;
      }

      if (stats) {
        const info = stats.toJson();

        if (stats.hasErrors()) {
          console.error(info.errors);
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
        }
      }

      res(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true, // Shows colors in the console
        })
      );
    });
  });

export async function webpackAsync(config) {
  try {
    return await webpackAsyncRaw(config);
  } catch (err) {
    console.error(err.message || err);
    if (err.details) {
      console.error(err.details);
    }
  }
}

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
export function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}
