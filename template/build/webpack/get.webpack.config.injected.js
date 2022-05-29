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
  return path.resolve(SRC_DIR, 'injected');
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

  return getScriptConfig(useJs, isProd, entry, output, replacements);
}
