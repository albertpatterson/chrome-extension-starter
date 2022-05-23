import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import promisify from 'util.promisify';
import ncp from 'ncp';
import { spawn } from 'child_process';

const rmp = promisify(rimraf);
const copyFile = promisify(fs.copyFile);
// const mkDir = promisify(fs.mkDir);
const target = path.resolve('tested');

async function copyCommonTemplates() {
  for (const file of [
    'babel.config.js',
    'jest.config.js',
    'package.json',
    'tsconfig.json',
    'src/manifest.json',
  ]) {
    const template = `./template/${file}`;
    const out = `./tested/${file}`;

    await copyFile(template, out);
  }

  await promisify(ncp)('./template/webpack', './tested/webpack');
  await promisify(ncp)('./template/src/icon', './tested/src/icon');
}

async function copyGulpfile(usJs) {
  const data = await fs.promises.readFile('./template/gulpfile.js');

  const updated = usJs
    ? data.toString().replace('const JS_ONLY = false;', 'const JS_ONLY = true;')
    : data;

  await fs.promises.writeFile('./tested/gulpfile.js', updated);
}

async function copyJsTemplates() {
  await promisify(ncp)('./template/src/js', './tested/src');
}

async function copyTsTemplates() {
  await promisify(ncp)('./template/src/ts', './tested/src');
}

const usJs = true;

await (async () => {
  await rmp(target);

  await fs.promises.mkdir('./tested');
  await fs.promises.mkdir('./tested/src');

  await copyCommonTemplates();

  await copyGulpfile(usJs);

  if (usJs) {
    await copyJsTemplates();
  } else {
    await copyTsTemplates();
  }

  // for (const file of [
  //   'babel.config.js',
  //   'jest.config.js',
  //   'package.json',
  //   'tsconfig.json',
  //   // 'src/manifest.json',
  // ]) {
  //   const innnn = `./template/${file}`;
  //   const out = `./tested/${file}`;

  //   await copyFile(innnn, out);
  // }

  // await promisify(ncp)('./template/webpack', './tested/webpack');
  // await promisify(ncp)('./template/src/js', './tested/src');
  // await promisify(ncp)('./template/src/icon', './tested/src/icon');
  // await promisify(ncp)(
  //   './template/src/manifest.json',
  //   './tested/src/manifest.json'
  // );

  // const data = await fs.promises.readFile('./template/gulpfile.js');

  // const updated = data
  //   .toString()
  //   .replace('const JS_ONLY = false;', 'const JS_ONLY = true;');

  // await fs.promises.writeFile('./tested/gulpfile.js', updated);

  // const cmd = exec('cd tested; npm install', { stdio: 'inherit' });
  // cmd.stderr.pipe(process.stderr);
  // cmd.stdout.pipe(process.stdout);

  // const cmd = spawn('cd tested; npm install', { stdio: 'inherit' });
  // cmd.stdout.on('data', (data) => {
  //   console.log(data);
  // });

  // cmd.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // cmd.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });

  const ls = spawn('npm', ['install'], { cwd: './tested', stdio: 'inherit' });
  // const ls = spawn('ls', ['-lh', '/usr']);

  // console.log(ls);

  // ls.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // ls.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // ls.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });

  // await fs.copy('template/gulpfile.js', 'tested/gulpfile.js');
})();
