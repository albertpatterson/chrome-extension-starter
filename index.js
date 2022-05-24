import { runTasks } from './run_tasks.js';

const config = {
  directory: 'tested',
  useJs: false,
};

await runTasks(config);
