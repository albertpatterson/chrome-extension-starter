/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

import fs from 'fs';
import path from 'path';
import { Listr } from 'listr2';
import { execa } from 'execa';
import * as url from 'url';
import * as tools from 'simple_build_tools';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, 'template');
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
  const commonFiles = await (
    await tools.getFiles(TEMPLATE_DIR)
  ).map((f) => [f]);

  const allFiles = [...commonFiles, ['src', 'manifest.json']];

  for (const file of allFiles) {
    const template = path.resolve(TEMPLATE_DIR, ...file);
    const out = path.resolve(writeDir, ...file);

    await tools.copyFile(template, out);
  }

  await tools.copyDir(
    path.resolve(TEMPLATE_DIR, 'build'),
    path.resolve(writeDir, 'build')
  );

  await tools.copyDir(
    path.resolve(TEMPLATE_DIR, 'src', 'icon'),
    path.resolve(writeDir, 'src', 'icon')
  );
}

async function copyJsTemplates(writeDir) {
  await tools.copyDir(
    path.resolve(TEMPLATE_DIR, 'src', 'js'),
    path.resolve(writeDir, 'src')
  );
}

async function copyTsTemplates(writeDir) {
  await tools.copyDir(
    path.resolve(TEMPLATE_DIR, 'src', 'ts'),
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

async function gitInit(writeDir) {
  const template = path.resolve(TEMPLATE_DIR, '.gitignore');
  const out = path.resolve(writeDir, '.gitignore');

  await tools.copyFile(template, out);

  await execa('git', ['init'], {
    cwd: writeDir,
  });

  await execa('git', ['add', '.'], {
    cwd: writeDir,
  });

  await execa('git', ['commit', '-am', '"initial"'], {
    cwd: writeDir,
  });
}

export async function runTasks(config) {
  const writeDir = config.writeDir;
  if (!writeDir) {
    throw new Error('invalid directory to write.');
  }

  const useJs = Boolean(config.useJs);

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
    {
      title: 'Write config & build files',
      task: () => copyCommonTemplates(writeDir),
    },
    { title: copyTemplagesForLangTitle, task: copyTemplatsForLang },
  ];

  if (config.install) {
    tasks.push({
      title: 'Install',
      task: (ctx, task) => npmInstall(ctx, task, writeDir),
    });
  }

  if (config.git) {
    tasks.push({
      title: 'Initialize git',
      task: () => gitInit(writeDir),
    });
  }

  const listr = new Listr(tasks);

  await listr.run();
}
