import arg from 'arg';
import inquirer from 'inquirer';

export async function get_settings(rawArgs) {
  const args = arg(
    {
      '--javascript': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-j': '--javascript',
      '-y': '--yes',
      '-i': '--install',
    },
    { argv: rawArgs.slice(2) }
  );

  const skipPrompts = args['--yes'] || false;

  const initialSettings = {
    writeDir: args._[0] || (skipPrompts ? 'browser_extension' : undefined),
    useJs: args['--javascript'] || (skipPrompts ? false : undefined),
    install: args['--install'] || (skipPrompts ? true : undefined),
  };

  const questions = [];
  if (initialSettings.writeDir === undefined) {
    questions.push({
      type: 'input',
      name: 'writeDir',
      message: 'Directory to write',
      validate: (value) => Boolean(value.match(/^[\w\-\_]+$/)),
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

  const answers = await inquirer.prompt(questions);

  return {
    ...initialSettings,
    writeDir: initialSettings.writeDir ?? answers.writeDir,
    useJs: initialSettings.useJs ?? answers.language === 'Javascript',
    install: initialSettings.install ?? answers.install,
  };
}
