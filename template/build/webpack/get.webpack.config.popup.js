import { __dirname } from './constants.js';
import path from 'path';
import { getConfig as getPageConfig } from './get.webpack.config.page.js';

export function getConfig(useJs, isProd) {
  const inputPath = path.resolve(__dirname, '..', '..', 'src', 'popup');
  const outputPath = path.resolve(
    __dirname,
    '..',
    '..',
    'dist',
    'unpacked',
    'popup'
  );

  return getPageConfig(useJs, isProd, inputPath, outputPath);
}
