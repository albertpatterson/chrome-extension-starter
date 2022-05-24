import { runTasks } from './run_tasks.js';
import { get_settings } from './get_settings.js';

try {
  const settings = await get_settings(process.argv);
  await runTasks(settings);
} catch (err) {
  console.log(err.message);
}
