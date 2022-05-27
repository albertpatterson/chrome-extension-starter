import { getConfig as getBackgroundConfig } from './webpack/get.webpack.config.background.js';
import { getConfig as getInjectedConfig } from './webpack/get.webpack.config.injected.js';
import { getConfig as getPopupConfig } from './webpack/get.webpack.config.popup.js';
import * as tools from 'simple_build_tools';
import { CONSTANTS } from './constants.js';

const useJs = false;

const configs = {
  background: getBackgroundConfig(useJs, false),
  injected: getInjectedConfig(useJs, false),
  popup: getPopupConfig(useJs, false),
};

const clean = () => tools.rmrf(CONSTANTS.DIST_DIR);
const bundleBackground = () => tools.webpack(configs.background);
const bundleInjected = () => tools.webpack(configs.injected);
const bundlePopup = () => tools.webpack(configs.popup);
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
    ])
  );

if (process.argv[2] === '-r') {
  await build();
}
