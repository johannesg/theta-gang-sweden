import { staticPlugin } from '@elysiajs/static';
import { app as mainApp } from './app';
// import { hmr } from './hmr';
// import { serve } from 'bun';
import Elysia from 'elysia';

const clients = new Set();

const app = new Elysia()
    .use(mainApp)
    .use(staticPlugin())
    // .use(hmr)
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
// serve(app);
// export default app;
