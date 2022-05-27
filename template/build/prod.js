import { getConfig as getBackgroundConfig } from './webpack/get.webpack.config.background.js';
import { getConfig as getInjectedConfig } from './webpack/get.webpack.config.injected.js';
import { getConfig as getPopupConfig } from './webpack/get.webpack.config.popup.js';
import * as tools from 'simple_build_tools';
import { CONSTANTS } from './constants.js';

const useJs = false;

const configs = {
  background: getBackgroundConfig(useJs, true),
  injected: getInjectedConfig(useJs, true),
  popup: getPopupConfig(useJs, true),
};

const clean = () => tools.rmrf(CONSTANTS.DIST_DIR);
const bundleBackground = () => tools.webpack(configs.background);
const bundleInjected = () => tools.webpack(configs.injected);
const bundlePopup = () => tools.webpack(configs.popup);
const copyIcons = () =>
  tools.copyDir(CONSTANTS.ICONS_DIR_SRC, CONSTANTS.ICONS_DIR_DESC);
const copyManifest = () =>
  tools.copyFile(CONSTANTS.MANIFEST_SRC_PATH, CONSTANTS.MANIFEST_DEST_PATH);

const createZip = () =>
  tools.zipDirectory(CONSTANTS.DIST_UNPACKED_DIR, CONSTANTS.ZIP_PATH);

export const build = async () =>
  tools.runTasks(
    tools.series([
      clean,
      tools.parallel([
        bundleBackground,
        bundleInjected,
        bundlePopup,
        copyIcons,
        copyManifest,
      ]),
      createZip,
    ])
  );

if (process.argv[2] === '-r') {
  await build();
}
