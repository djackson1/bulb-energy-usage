import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { initialize } from './data';
import meterReadingsRouter from './routes/meter-readings'

const PORT = process.env.PORT || 3000;

// interface Server {
//   // id:number;
//   listen: Function;
// }

const bodyParser = require('koa-bodyparser');


export default function createServer(): Koa {
  const server = new Koa();

  // server.use(async ctx => {
  //   // the parsed body will store in ctx.request.body
  //   // if nothing was parsed, body will be an empty object {}
  //   ctx.body = ctx.request.body;
  // })

  server.use(bodyParser())
  // server.use(function* () {
  //   // the parsed body will store in this.request.body
  //   // if nothing was parsed, body will be an empty object {}
  //   this.body = this.request.body;
  // });

  // health check
  const router = new KoaRouter();
  server.use(router.routes())
  server.use(router.allowedMethods())

  router.get('/', (ctx, next) => {
    ctx.body = 'Hello world';
    next();
  });

  // add in the meter reading routes [could refactor?]
  // server.use(meterReadingsRouter.routes());
  // server.use(meterReadingsRouter.allowedMethods());
  server.use(meterReadingsRouter.middleware())

  return server;
}

if (!module.parent) {
  initialize();
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}
