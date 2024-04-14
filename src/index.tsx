import http from 'node:http';
// import express from 'express'
import { setTimeout } from 'node:timers/promises';
import Html, { type PropsWithChildren } from '@kitajs/html'
import { Suspense, renderToStream } from '@kitajs/html/suspense';

async function SleepForMs({ ms, children }: PropsWithChildren<{ ms: number }>) {
  await setTimeout(ms * 2);
  return Html.contentsToString([children || String(ms)]);
}
  
function renderLayout(rid: number | string) {
  return (
    <html>
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
    </html>
  );
}

// const app = express()
// const port = process.env['PORT'] || 8080

// SIGTERM Handler
process.on('SIGTERM', async () => {
    console.info('[express] SIGTERM received');

    console.info('[express] cleaning up');
    // perform actual clean up work here.
    await setTimeout(100);

    console.info('[express] exiting');
    process.exit(0)
});

// TODO: get expressjs working

// app.get('/', (_, res) => {
//     // ⚠️ Charset utf8 is important to avoid old browsers utf7 xss attacks
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');

//     // Creates the html stream
//     const htmlStream = renderToStream(renderLayout);

//     // Pipes it into the response
//     htmlStream.pipe(res);

//     res.type('text/html; charset=utf-8').send(htmlStream);
// })

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

// copied from suspense example
http
  .createServer((req, response) => {
    // ⚠️ Charset utf8 is important to avoid old browsers utf7 xss attacks
    response.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Creates the html stream
    const htmlStream = renderToStream(renderLayout);

    // Pipes it into the response
    htmlStream.pipe(response);

    // If its an express or fastify server, just use
    // response.type('text/html; charset=utf-8').send(htmlStream);
  })
  .listen(8080, () => {
    console.log('Listening to http://localhost:8080');
  });