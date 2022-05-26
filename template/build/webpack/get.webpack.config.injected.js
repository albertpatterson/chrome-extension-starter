import path from 'path';
import { getConfig as getScriptConfig } from './get.webpack.config.srcipt.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getContext() {
  return path.resolve(__dirname, '..', '..', 'src', 'injected');
}

function getEntry(useJs, isProd) {
  const context = getContext();

  const suffix = useJs ? 'js' : 'ts';

  return {
    all_pages: path.resolve(context, `all_pages.${suffix}`),
    home_page: path.resolve(context, `home_page.${suffix}`),
  };
}

export function getConfig(useJs, isProd) {
  const entry = getEntry(useJs, isProd);
  const output = {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', '..', 'dist', 'unpacked', 'injected'),
    clean: true,
  };

  return getScriptConfig(useJs, isProd, entry, output);
}
