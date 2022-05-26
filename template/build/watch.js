import { CONSTANTS } from './constants.js';
import chokidar from 'chokidar';
import { build } from './dev.js';
import _ from 'lodash';
import livereload from 'livereload';
import chalk from 'chalk';

(async () => {
  const server = livereload.createServer();

  async function buildAndReload() {
    await build();
    server.refresh('');
    console.log(chalk.bgMagenta('Reloaded'));
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
