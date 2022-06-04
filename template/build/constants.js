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
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const SRC_DIR = path.resolve(__dirname, '..', 'src');
const DIST_UNPACKED_DIR = path.resolve(DIST_DIR, 'unpacked');

export const CONSTANTS = {
  SRC_DIR,
  DIST_DIR,
  DIST_UNPACKED_DIR,
  ZIP_PATH: path.resolve(DIST_DIR, 'extension.zip'),
  ICONS_DIR_SRC: path.resolve(SRC_DIR, 'icon'),
  ICONS_DIR_DESC: path.resolve(DIST_UNPACKED_DIR, 'icon'),
  MANIFEST_SRC_PATH: path.resolve(SRC_DIR, 'manifest.json'),
  MANIFEST_DEST_PATH: path.resolve(DIST_UNPACKED_DIR, 'manifest.json'),
};

Object.freeze(CONSTANTS);
