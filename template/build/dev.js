import { getConfig as getBackgroundConfig } from './webpack/get.webpack.config.background.js';
import { getConfig as getInjectedConfig } from './webpack/get.webpack.config.injected.js';
import { getConfig as getPopupConfig } from './webpack/get.webpack.config.popup.js';
import * as tools from './tools.js';
import { CONSTANTS } from './constants.js';

const useJs = false;

const configs = {
  background: getBackgroundConfig(useJs, false),
  injected: getInjectedConfig(useJs, false),
  popup: getPopupConfig(useJs, false),
};

const clean = () => tools.rmrf(CONSTANTS.DIST_DIR);
const bundleBackground = () => tools.webpackAsync(configs.background);
const bundleInjected = () => tools.webpackAsync(configs.injected);
const bundlePopup = () => tools.webpackAsync(configs.popup);
const copyIcons = () =>
  tools.copyDir(CONSTANTS.ICONS_DIR_SRC, CONSTANTS.ICONS_DIR_DESC);
const copyManifest = () =>
  tools.transformFile(
    CONSTANTS.MANIFEST_SRC_PATH,
    CONSTANTS.MANIFEST_DEST_PATH,
    (json) => {
      const data = JSON.parse(json);
      const permissions = new Set(data.permissions);
      permissions.add('alarms');
      data.permissions = Array.from(permissions);
      return JSON.stringify(data);
    }
  );

export async function build() {
  const start = Date.now();
  await tools.series([
    clean,
    tools.parallel([
      bundleBackground,
      bundleInjected,
      bundlePopup,
      copyIcons,
      copyManifest,
    ]),
  ])();
  console.log(`took ${Date.now() - start}ms`);
}

if (process.argv[2] === '-r') {
  await build();
}
