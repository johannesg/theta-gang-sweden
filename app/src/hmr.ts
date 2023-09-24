import Elysia from 'elysia';
import { watch } from 'fs';

// const watchDir = import.meta.dir;
const watchDir = "./public/styles.css";

const hmr = new Elysia()
    .ws('/ws/hmr', {
        message(ws, message) {
            console.log(`Incoming message: ${message}`);
            ws.subscribe("reload");
        },
        open(ws) {
            console.log(`HMR Socket connected.`);
        },
        close(ws) {
            console.log(`HMR Socket disconnected.`);
        }
    });

console.log(`watching ${watchDir}`);

const watcher = watch(watchDir, (event, filename) => {
  console.log(`Detected '${event}' in ${filename}`);
  hmr.server?.publish("reload", "RELOAD");
});

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});

hmr.listen(3001);
