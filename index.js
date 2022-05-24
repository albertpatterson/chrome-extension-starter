#!/usr/bin/env node

import { runTasks } from './run_tasks.js';
import { getSettings } from './get_settings.js';

try {
  const settings = await getSettings(process.argv);
  await runTasks(settings);
} catch (err) {
  console.error(err.message);
}
