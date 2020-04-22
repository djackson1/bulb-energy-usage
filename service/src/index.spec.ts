import * as Koa from 'koa';

import appServer from './index';
import { expect } from 'chai';
import * as supertest from "supertest";

const PORT = process.env.PORT || 3000;

describe('index', () => {

  // DUPE TEST SETUP
  let request = null
  let server = null
  let instance = null
  beforeEach(() => {
    server = appServer()
    instance = server.listen(PORT);
    request = supertest.agent(instance)
  })

  afterEach(() => {
    instance.close()
  })
  // DUPE TEST SETUP

  it('should create an instance of a Koa server', () => {
    expect(server).to.be.instanceof(Koa);
  })

  it('should return hello world', async () => {
    const response = await request.get('/')
    // console.log("response", response)
    const { error, res } = response
    // console.log("res", res.request.rawBody)

    expect(res.statusCode).to.equal(200)
    expect(error).to.be.false
    expect(res.text).to.equal("Hello world")
  })

  it('should handle an unknown route', async () => {
    const { error, res } = await request.get('/unknown-route')

    expect(res.statusCode).to.equal(404)
    expect(res.text).to.equal("Not Found")
  })
})
