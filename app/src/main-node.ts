import { app } from './app';
import { serve } from '@hono/node-server'
import { watch } from 'fs';

const watchDir = "./tailwind-gen/styles.css";

console.log(`watching ${watchDir}`);

const watcher = watch(watchDir, (event, filename) => {
  console.log(`Detected '${event}' in ${filename}`);
});

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});

serve(app);

console.log(`Hono is running at http://localhost:3000`);

