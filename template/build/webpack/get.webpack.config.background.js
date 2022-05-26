import path from 'path';
import { getConfig as getScriptConfig } from './get.webpack.config.srcipt.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getContext() {
  return path.resolve(__dirname, '..', '..', 'src', 'background');
}

function getEntry(useJs, isProd) {
  const context = getContext();

  const suffix = useJs ? 'js' : 'ts';

  const prodEntries = [path.resolve(context, `service_worker.${suffix}`)];

  if (isProd) {
    return prodEntries;
  }

  return [
    ...prodEntries,
    path.resolve(context, 'dev_mode_only', `chromereload.${suffix}`),
    path.resolve(context, 'dev_mode_only', `keep_active.${suffix}`),
  ];
}

export function getConfig(useJs, isProd) {
  const entry = getEntry(useJs, isProd);
  const output = {
    filename: 'service_worker.js',
    path: path.resolve(__dirname, '..', '..', 'dist', 'unpacked', 'background'),
    clean: true,
  };

  return getScriptConfig(useJs, isProd, entry, output);
}
