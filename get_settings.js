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
      '--yes': Boolean,
      '--install': Boolean,
      '--git': Boolean,
      '-j': '--javascript',
      '-y': '--yes',
      '-i': '--install',
      '-g': '--git',
    },
    { argv: rawArgs.slice(2) }
  );

  const skipPrompts = args['--yes'] || false;

  const providedWriteDirName = args._[0];
  const writeDir = getWriteDir(providedWriteDirName, skipPrompts);

  const initialSettings = {
    writeDir,
    useJs: args['--javascript'] || (skipPrompts ? false : undefined),
    install: args['--install'] || (skipPrompts ? true : undefined),
    git: args['--git'] || (skipPrompts ? true : undefined),
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
