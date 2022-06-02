import { __dirname } from './constants.js';
import path from 'path';
import { getConfig as getPageConfig } from './get.webpack.config.page.js';

export async function getConfig(isProd) {
  const inputPath = path.resolve(__dirname, '..', '..', 'src', 'popup');
  const outputPath = path.resolve(
    __dirname,
    '..',
    '..',
    'dist',
    'unpacked',
    'popup'
  );

  return await getPageConfig(isProd, inputPath, outputPath);
}
