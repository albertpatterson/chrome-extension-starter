import fs, { write } from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import promisify from 'util.promisify';
import ncp from 'ncp';
import { spawn } from 'child_process';
import { Listr } from 'listr2';
import { execa } from 'execa';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const rmp = promisify(rimraf);
const copyFile = promisify(fs.copyFile);

function getSrcPath(writePath) {
  return path.resolve(writePath, 'src');
}

async function setup(writePath) {
  await rmp(writePath);
  await fs.promises.mkdir(writePath);
  await fs.promises.mkdir(getSrcPath(writePath));
}

async function copyCommonTemplates(writePath) {
  for (const file of [
    ['babel.config.js'],
    ['jest.config.js'],
    ['package.json'],
    ['tsconfig.json'],
    ['src', 'manifest.json'],
  ]) {
    const template = path.resolve(__dirname, 'template', ...file);
    const out = path.resolve(writePath, ...file);

    await copyFile(template, out);
  }

  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'webpack'),
    path.resolve(writePath, 'webpack')
  );

  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'src', 'icon'),
    path.resolve(writePath, 'src', 'icon')
  );
}

async function copyGulpfile(usJs, writePath) {
  const data = await fs.promises.readFile(
    path.resolve(__dirname, 'template', 'gulpfile.js')
  );

  const langSpecific = usJs
    ? data.toString().replace('const JS_ONLY = false;', 'const JS_ONLY = true;')
    : data;

  await fs.promises.writeFile(
    path.resolve(writePath, 'gulpfile.js'),
    langSpecific
  );
}

async function copyJsTemplates(writePath) {
  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'src', 'js'),
    path.resolve(writePath, 'src')
  );
}

async function copyTsTemplates(writePath) {
  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'src', 'ts'),
    path.resolve(writePath, 'src')
  );
}

async function npmInstall(ctx, task, writePath) {
  task.output = 'installing';
  let numPeriods = 0;

  const taskOutputUpdater = setInterval(() => {
    numPeriods = (numPeriods + 1) % 4;
    const suffix = [];
    suffix.length = numPeriods;
    suffix.fill('.');
    task.output = 'installing' + suffix.join('');
  }, 500);

  task.output = 'installing...';

  const cmd = await execa('npm', ['install'], {
    cwd: writePath,
  });

  clearInterval(taskOutputUpdater);
}

export async function runTasks(config) {
  const writeDir = config.writeDir || 'browser-extension';
  const useJs = Boolean(config.useJs);

  const writePath = path.resolve(__dirname, writeDir);

  const copyGulpFileForLang = () => copyGulpfile(useJs, writePath);
  const copyTemplagesForLangTitle = useJs
    ? 'Write JS sources'
    : 'Write TS sources';
  const copyTemplatsForLang = () =>
    useJs ? copyJsTemplates(writePath) : copyTsTemplates(writePath);

  const tasks = [
    {
      title: 'setup',
      task: () => setup(writePath),
    },
    { title: 'Write config files', task: () => copyCommonTemplates(writePath) },
    { title: 'Write build file', task: copyGulpFileForLang },
    { title: copyTemplagesForLangTitle, task: copyTemplatsForLang },
  ];

  if (config.install) {
    tasks.push({
      title: 'Install',
      task: (ctx, task) => npmInstall(ctx, task, writePath),
    });
  }

  const listr = new Listr(tasks);

  await listr.run();
}
