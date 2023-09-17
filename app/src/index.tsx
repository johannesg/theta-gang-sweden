import { app } from './app';
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

app.use('/static/*', serveStatic({ root: './tailwind-gen' }))

serve(app);

console.log(`Hono is running at http://localhost:3000`);

