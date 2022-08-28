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

import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';

function getFullWriteDir(writeDirName) {
  return path.resolve(process.cwd(), writeDirName);
}

function isWriteDirNameValid(writeDir) {
  if (writeDir === '.') {
    return true;
  }

  return Boolean(writeDir.match(/^[\w\-\_]+$/));
}

function getWriteDir(providedWriteDirName, acceptDefaults) {
  let writeDirName =
    providedWriteDirName && isWriteDirNameValid(providedWriteDirName)
      ? providedWriteDirName
      : undefined;

  writeDirName =
    writeDirName || (acceptDefaults ? 'browser_extension' : undefined);

  return writeDirName && getFullWriteDir(writeDirName);
}

async function getInitialSettings(rawArgs) {
  const args = arg(
    {
      '--javascript': Boolean,
      '--typescript': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--skip-install': Boolean,
      '--git': Boolean,
      '--skip-git': Boolean,
      '-j': '--javascript',
      '-t': '--typescript',
      '-y': '--yes',
      '-i': '--install',
      '-I': '--skip-install',
      '-g': '--git',
      '-G': '--skip-git',
    },
    { argv: rawArgs.slice(2) }
  );

  const skipPrompts = args['--yes'] || false;

  const providedWriteDirName = args._[0];
  const writeDir = getWriteDir(providedWriteDirName, skipPrompts);

  const useJs = getBooleanForArg(args, '--javascript', '--typescript');
  const install = getBooleanForArg(args, '--install', '--skip-install');
  const initGit = getBooleanForArg(args, '--git', '--skip-git');

  const initialSettings = {
    writeDir,
    useJs: useJs ?? (skipPrompts ? false : undefined),
    install: install ?? (skipPrompts ? true : undefined),
    git: initGit ?? (skipPrompts ? true : undefined),
  };

  const questions = [];
  if (initialSettings.writeDir === undefined) {
    questions.push({
      type: 'input',
      name: 'writeDirName',
      message: 'Directory Name to write',
      validate: isWriteDirNameValid,
    });
  }

  if (initialSettings.useJs === undefined) {
    questions.push({
      type: 'list',
      name: 'language',
      message: 'Language',
      choices: ['Typescript', 'Javascript'],
    });
  }

  if (initialSettings.install === undefined) {
    questions.push({
      type: 'confirm',
      name: 'install',
      message: 'Run npm install?',
    });
  }

  if (initialSettings.install === undefined) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize git?',
    });
  }

  const answers = await inquirer.prompt(questions);

  const writeDirUpdated =
    initialSettings.writeDir ?? getWriteDir(answers.writeDirName, false);

  return {
    ...initialSettings,
    writeDir: writeDirUpdated,
    useJs: initialSettings.useJs ?? answers.language === 'Javascript',
    install: initialSettings.install ?? answers.install,
    git: initialSettings.git ?? answers.git,
  };
}

function getFinishingDescription(initialSettings) {
  if (initialSettings.install && initialSettings.git) {
    return 'then install and initialize git';
  } else if (initialSettings.install) {
    return 'then install';
  } else if (initialSettings.git) {
    return 'then initialize git';
  }

  return '';
}

async function confirmSettings(initialSettings) {
  const fullWriteDir = path.resolve(process.cwd(), initialSettings.writeDir);

  const confirmMessage = `Overwrite all contents at ${fullWriteDir} and replace with ${
    initialSettings.useJs ? 'javascript' : 'typescript'
  } templates ${getFinishingDescription(initialSettings)}`;

  const question = {
    type: 'confirm',
    name: 'confirm',
    message: confirmMessage,
  };

  const answers = await inquirer.prompt([question]);
  return answers.confirm;
}

export async function getSettings(rawArgs) {
  let initialSettings = await getInitialSettings(rawArgs);

  while (true) {
    const confirmed = await confirmSettings(initialSettings);

    if (confirmed) {
      return initialSettings;
    } else {
      initialSettings = await getInitialSettings([]);
    }
  }
}

function getBooleanForArg(args, argTrue, argFalse) {
  if (args[argTrue]) {
    return true;
  } else if (args[argFalse]) {
    return false;
  }
}
