// import * as Koa from 'koa';

import appServer from './../../index';
import { expect } from 'chai';
import * as supertest from "supertest";

const PORT = process.env.PORT || 3000;

const chai = require("chai");
// const chaiHttp = require("chai-http");
// chai.use(chaiHttp);





describe('ROUTE /meter-readings/', () => {
  let request = null
  let server = null
  let instance = null

  // DUPE TEST SETUP
  beforeEach(() => {
    server = appServer()
    instance = server.listen(PORT);
    request = supertest.agent(instance)
  })

  afterEach(() => {
    instance.close()
  })
  // DUPE TEST SETUP

  describe('/GET', () => {
    it('should return all of the meter readings', async () => {
      const response = await request
        .get('/meter-readings')
      // .expect('Content-Type', /json/)
      // .expect(200)

      // console.log("response", response)
      // console.log("RES123", response.body)
      expect(response.body).to.be.an('array')
      // console.log("response.body", response.body)
    })
  })

  describe('/POST', () => {
    const getAllMeterReadings = async () => {
      const response = await request.get('/meter-readings')
      return response.body
    }

    const sendRequest = (params = {}) => {
      return request
        .post('/meter-readings')
        .set('Accept', 'application/json')
        .send(params)
    }

    // POST
    describe('it should not add meter readings', () => {
      it("when no params are sent", async () => {
        await sendRequest().expect(400)
      })
      it('when param "cumulative" is missing', async () => {
        await sendRequest({ date: "2017-06-18T00:00:00.000Z" }).expect(400)
      })
      it('when param "date" is missing', async () => {
        await sendRequest({ cumulative: 20123 }).expect(400)
      })
    })

    describe('it should add meter readings', () => {
      it('when all required params are sent', async () => {
        await sendRequest({
          cumulative: 20123,
          date: "2017-06-18T00:00:00.000Z"
        }).expect(200)
      })
    })

    it('should add an entry to the database', async () => {
      const resultsBefore = await getAllMeterReadings()

      const result = await sendRequest({
        cumulative: 20123,
        date: "2017-06-18T00:00:00.000Z"
      })

      const resultsAfter = await getAllMeterReadings()

      expect(resultsAfter.length).to.equal(resultsBefore.length + 1)

      expect(result.body).to.be.an('object')
      expect(result.body.cumulative).to.equal(20123)
      expect(result.body.date).to.equal("2017-06-18T00:00:00.000Z")
    })
  })
})