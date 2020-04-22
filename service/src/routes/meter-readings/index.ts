import * as Koa from 'koa';
const koaRouter = require('koa-joi-router');
import { connection } from './../../data';

type KoaRouterError = {
  status: number
}

const Joi = koaRouter.Joi
const router = koaRouter()

router.route({
  method: 'get',
  path: '/meter-readings',
  validate: {
    output: {
      200: {
        body: Joi.array()
      }
    }
  },
  handler: async (ctx: Koa.Context) => {
    const rows = await new Promise((resolve, reject) => {
      connection.all('SELECT * FROM meter_reads', function (err: KoaRouterError, rows) {
        if (err) {
          reject(err.status || 500)
          return
        }

        resolve(rows)
      })
    })

    ctx.body = rows
  }
})

router.route({
  method: 'post',
  path: '/meter-readings',
  validate: {
    type: 'json',
    body: {
      cumulative: Joi.number().required(),
      date: Joi.string().required(),
    },
    output: {
      200: {
        body: {
          cumulative: Joi.number(),
          date: Joi.string()
        }
      }
    }
  },
  handler: async (ctx: Koa.Context) => {
    const { cumulative, date } = ctx.request.body

    const result = await new Promise((resolve, reject) => {
      connection.run(
        "INSERT INTO meter_reads (cumulative, reading_date, unit) VALUES (?, ?, 'kWh')",
        [cumulative, date],
        function (err: KoaRouterError, rows) {
          if (err) {
            reject(err.status || 500)
            return
          }

          resolve({ cumulative, date })
        })
    })

    ctx.body = result
  }
})

export default router