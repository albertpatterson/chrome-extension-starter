import path from 'path';
import { getConfig as getScriptConfig } from './get.webpack.config.srcipt.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
  return path.resolve(SRC_DIR, 'background');
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
    path: path.resolve(TOP_DIR, 'dist', 'unpacked', 'background'),
    clean: true,
  };

  const replacements = [
    [
      new RegExp(
        path.resolve(MESSAGE_SYSTEMS_DIR, '.*', 'handle_async_in_tab.ts')
      ),
      path.resolve(MESSAGE_SYSTEMS_DIR, 'noops', 'handle_async_in_tab.ts'),
    ],
  ];

  return getScriptConfig(useJs, isProd, entry, output, replacements);
}
