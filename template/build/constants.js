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
