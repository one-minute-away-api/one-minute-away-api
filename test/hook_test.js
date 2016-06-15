'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const User = require('../model/user');
const Alert = require('../model/alert');
const mongoose = require('mongoose');
chai.use(chaiHTTP);
const expect = chai.expect;
const request = chai.request;


process.env.MONGODB_URI = 'mongodb://localhost/test_db';

require('../server');

describe('Firealert hook should', () => {
  let testUser;
  let testAlert;
  beforeEach((done) => {
    let newUser = new User({
      username: 'testuser',
      password: '$2a$08$pMewnngJdnSYxMz6dVcl8.H6PSiCqGCEP8Gri5zA6asB/qChSFMHq',
      phoneNumber: '14052504941',
      email: 'test@test.com'
    });
    newUser.save((err, user) => {
      testUser = user;
      let newAlert = new Alert({
        userId: testUser._id,
        alertTimeOffset: '60',
        routeId: 'testID'
      });
      newAlert.save((err, alert) => {
        if (err) return err;
        testAlert = alert;
        done();
      });
    });
  });
  afterEach((done) => {
    mongoose.connect(process.env.MONGODB_URI, function () {
      /* Drop the DB */
      mongoose.connection.db.dropDatabase(() => {
        done();
      });
    });
  });

  it('return an alert fired', (done) => {
    request('localhost:3000')
      .get('/hook/firealert?ALERT_ID=' + testAlert._id)
      .end((err, res) => {
        expect(res.body.message).to.eql('alert fired');
        expect(err).to.eql(null);
        done();
      });
  });
});
