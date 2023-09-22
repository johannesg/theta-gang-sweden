import { staticPlugin } from '@elysiajs/static';
import { app as mainApp } from './app';
import { serve } from 'bun';
import Elysia from 'elysia';
import { watch } from 'fs';

// const watchDir = import.meta.dir;
const watchDir = "./public/styles.css";


const clients = new Set();

const app = new Elysia()
    .use(mainApp)
    .use(staticPlugin())
    .ws('/ws/hmr', {
        message(ws, message) {
            console.log(`Incoming message: ${message}`);
            ws.subscribe("reload");
        },
        open(ws) {
            clients.add(ws);
            console.log(`HMR Socket connected. Clients: ${clients.size}`);
        },
        close(ws) {
            clients.delete(ws);
            console.log(`HMR Socket disconnected. Clients: ${clients.size}`);
        }
    })
    .listen(3000);


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);


console.log(`watching ${watchDir}`);

const watcher = watch(watchDir, (event, filename) => {
  console.log(`Detected '${event}' in ${filename}`);
  app.server?.publish("reload", "RELOAD");
});

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});
// serve(app);
