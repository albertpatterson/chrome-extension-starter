import { __dirname } from './constants.js';
import path from 'path';
import { getConfig as getPageConfig } from './get.webpack.config.page.js';

export async function getConfig(isProd) {
  const inputPath = path.resolve(__dirname, '..', '..', 'src', 'options');
  const outputPath = path.resolve(
    __dirname,
    '..',
    '..',
    'dist',
    'unpacked',
    'options'
  );

  return await getPageConfig(isProd, inputPath, outputPath);
}
