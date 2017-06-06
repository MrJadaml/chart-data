'use strict';

const chai = require('chai')
const should = chai.should();
const request = require('supertest-as-promised');
const app = require('../app');

describe('/chartdata', () => {
  it('should respond with a 400 if missing query params', done => {
    request(app)
      .get('/chartdata')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(res => {
        res.body.message.should.equal('Missing room, start_date, or title');
        done();
      })
  });

  it('should respond with timesamp and sensor value when given valid query params', done => {
    request(app)
      .get('/chartdata')
      .query({title: 'temperature'})
      .query({room: 'Hoop 1'})
      .query({startDate: '2017-01-25T12:21:07.891z'})
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        res.body.should.be.an('array');
        res.body.should.have.lengthOf.below(433);
        res.body[0].should.have.all.keys('timestamp', 'value');
        done();
      })
  });
});
