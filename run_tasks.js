import fs from 'fs';
import path from 'path';
import promisify from 'util.promisify';
import ncp from 'ncp';
import { Listr } from 'listr2';
import { execa } from 'execa';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const copyFile = promisify(fs.copyFile);

function getSrcPath(writeDir) {
  return path.resolve(writeDir, 'src');
}

async function tryMkdir(dir) {
  try {
    await fs.promises.mkdir(dir);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function setup(writeDir) {
  await tryMkdir(writeDir);
  await tryMkdir(getSrcPath(writeDir));
}

async function copyCommonTemplates(writeDir) {
  for (const file of [
    ['babel.config.js'],
    ['jest.config.js'],
    ['package.json'],
    ['tsconfig.json'],
    ['src', 'manifest.json'],
  ]) {
    const template = path.resolve(__dirname, 'template', ...file);
    const out = path.resolve(writeDir, ...file);

    await copyFile(template, out);
  }

  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'webpack'),
    path.resolve(writeDir, 'webpack')
  );

  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'src', 'icon'),
    path.resolve(writeDir, 'src', 'icon')
  );
}

async function copyGulpfile(usJs, writeDir) {
  const data = await fs.promises.readFile(
    path.resolve(__dirname, 'template', 'gulpfile.js')
  );

  const langSpecific = usJs
    ? data.toString().replace('const JS_ONLY = false;', 'const JS_ONLY = true;')
    : data;

  await fs.promises.writeFile(
    path.resolve(writeDir, 'gulpfile.js'),
    langSpecific
  );
}

async function copyJsTemplates(writeDir) {
  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'src', 'js'),
    path.resolve(writeDir, 'src')
  );
}

async function copyTsTemplates(writeDir) {
  await promisify(ncp)(
    path.resolve(__dirname, 'template', 'src', 'ts'),
    path.resolve(writeDir, 'src')
  );
}

async function npmInstall(ctx, task, writeDir) {
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
    cwd: writeDir,
  });

  clearInterval(taskOutputUpdater);
}

export async function runTasks(config) {
  const writeDir = config.writeDir;
  if (!writeDir) {
    throw new Error('invalid directory to write.');
  }

  const useJs = Boolean(config.useJs);

  const copyGulpFileForLang = () => copyGulpfile(useJs, writeDir);
  const copyTemplagesForLangTitle = useJs
    ? 'Write JS sources'
    : 'Write TS sources';
  const copyTemplatsForLang = () =>
    useJs ? copyJsTemplates(writeDir) : copyTsTemplates(writeDir);

  const tasks = [
    {
      title: 'setup',
      task: () => setup(writeDir),
    },
    { title: 'Write config files', task: () => copyCommonTemplates(writeDir) },
    { title: 'Write build file', task: copyGulpFileForLang },
    { title: copyTemplagesForLangTitle, task: copyTemplatsForLang },
  ];

  if (config.install) {
    tasks.push({
      title: 'Install',
      task: (ctx, task) => npmInstall(ctx, task, writeDir),
    });
  }

  const listr = new Listr(tasks);

  await listr.run();
}
