/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

import { getConfig as getBackgroundConfig } from './webpack/get.webpack.config.background.js';
import { getConfig as getInjectedConfig } from './webpack/get.webpack.config.injected.js';
import { getConfig as getPopupConfig } from './webpack/get.webpack.config.popup.js';
import { getConfig as getOptionsConfig } from './webpack/get.webpack.config.options.js';
import * as tools from 'simple_build_tools';
import { CONSTANTS } from './constants.js';

const clean = () => tools.rmrf(CONSTANTS.DIST_DIR);
const bundleBackground = async () => {
  const config = await getBackgroundConfig(false);
  return await tools.webpack(config);
};
const bundleInjected = async () => {
  const config = await getInjectedConfig(false);
  return await tools.webpack(config);
};
const bundlePopup = async () => {
  const config = await getPopupConfig(false);
  return await tools.webpack(config);
};
const bundleOptions = async () => {
  const config = await getOptionsConfig(false);
  return await tools.webpack(config);
};
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
        bundleOptions,
        copyIcons,
        copyManifest,
      ]),
    ])
  );

if (process.argv[2] === '-r') {
  await build();
}
