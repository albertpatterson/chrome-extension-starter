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

import path from 'path';
import { getConfig as getScriptConfig } from './get.webpack.config.srcipt.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDirs, getFileWithName } from 'simple_build_tools';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOP_DIR = path.resolve(__dirname, '..', '..');
const SRC_DIR = path.resolve(TOP_DIR, 'src');
const MESSAGE_SYSTEMS_DIR = path.resolve(
  SRC_DIR,
  'messaging',
  'message_systems'
);

function getContext() {
  return path.resolve(SRC_DIR, 'injected');
}

async function getEntry() {
  const context = getContext();

  const names = await getDirs(context);

  const entry = {};
  for (const name of names) {
    const dir = path.resolve(context, name);
    const indexName = await getFileWithName(dir, 'index', ['js', 'ts']);
    entry[name] = path.resolve(context, name, indexName);
  }

  return entry;
}

export async function getConfig(isProd) {
  const entry = await getEntry();
  const output = {
    filename: '[name].js',
    path: path.resolve(TOP_DIR, 'dist', 'unpacked', 'injected'),
    clean: true,
  };

  const replacements = [
    [
      new RegExp(
        path.resolve(
          MESSAGE_SYSTEMS_DIR,
          '.*',
          'handle_async_in_service_worker.ts'
        )
      ),
      path.resolve(
        MESSAGE_SYSTEMS_DIR,
        'noops',
        'handle_async_in_service_worker.ts'
      ),
    ],
  ];

  return getScriptConfig(isProd, entry, output, replacements);
}
