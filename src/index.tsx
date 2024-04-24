import express from 'express';
import { setTimeout } from 'node:timers/promises';
import Html, { type PropsWithChildren } from '@kitajs/html';
import { Suspense, renderToStream } from '@kitajs/html/suspense';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';

dotenv.config();

async function SleepForMs({ ms, children }: PropsWithChildren<{ ms: number }>) {
  await setTimeout(ms * 2);
  return Html.contentsToString([children || String(ms)]);
}
  
function renderLayout(rid: number | string) {
  return (
    <html>
      <head>
        <title>Cool HTMX website!</title>
      </head>
      <body>
        <img src="/assets/spongebob.webp" />
        <div>
        {Array.from({ length: 5 }, (_, i) => (
          <Suspense rid={rid} fallback={<div>{i} FIuter</div>}>
            <div>Outer {i}!</div>

            <SleepForMs ms={i % 2 === 0 ? i * 1000 : i * 2000}>
              <Suspense rid={rid} fallback={<div>{i} FInner!</div>}>
                <SleepForMs ms={i * 1000}>
                  <div>Inner {i}!</div>
                </SleepForMs>
              </Suspense>
            </SleepForMs>
          </Suspense>
        ))}
      </div>
      </body>
    </html>
  );
}

const app = express();
const port = process.env['PORT'] || 8080;

app.use((req, res, next) => {
  // for some reason https not detected in LWA apps
  const baseURL = `${process.env.LAMBDA_TASK_ROOT ? 'https' : req.protocol}://${req.header('x-forwarded-host') || req.get('host')}`;
  console.log('url: ', baseURL)
  return auth({
    baseURL
  })(req, res, next);
});

// SIGTERM Handler
process.on('SIGTERM', async () => {
  console.info('[express] SIGTERM received');
  console.info('[express] cleaning up');
  // Add any necessary cleanup here
  console.info('[express] exiting');
  process.exit(0);
});

app.use('/assets', express.static('public'))

app.get('/', (_req, res) => {
  // ⚠️ Charset utf8 is important to avoid old browsers utf7 xss attacks
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Creates the html stream
  const htmlStream = renderToStream(renderLayout);

  // Pipes it into the response
  res.type('text/html; charset=utf-8')
  htmlStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
