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

import { CONSTANTS } from './constants.js';
import chokidar from 'chokidar';
import { build } from './dev.js';
import _ from 'lodash';
import livereload from 'livereload';
import chalk from 'chalk';

(async () => {
  const server = livereload.createServer();

  async function buildAndReload() {
    try {
      await build();
      server.refresh('');
      console.log(chalk.bgMagenta('Reloaded'));
    } catch (error) {
      console.log(error.stack || error.message || error.details);
    }
  }

  const debouncedBuild = _.debounce(buildAndReload, 1e3);

  chokidar
    .watch(CONSTANTS.SRC_DIR)
    .on('add', (path) => {
      debouncedBuild();
    })
    .on('change', (path) => {
      debouncedBuild();
    })
    .on('unlink', (path) => {
      debouncedBuild();
    });
})();
