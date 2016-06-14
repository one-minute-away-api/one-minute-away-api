'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const User = require('../model/user');
const mongoose = require('mongoose');
chai.use(chaiHTTP);
const expect = chai.expect;
const request = chai.request;
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'changeme';
const dbPort = process.env.MONGOLAB_URI;

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';

require('../server');

describe('User routes', () => {
  let testUser;
  let token;
  beforeEach((done) => {
    let newUser = new User({
      username: 'testuser',
      password: '$2a$08$pMewnngJdnSYxMz6dVcl8.H6PSiCqGCEP8Gri5zA6asB/qChSFMHq',
      phoneNumber: '555555555',
      email: 'test@test.com',
      routes: []
    });
    newUser.save((err, user) => {
      testUser = user;
      token = jwt.sign({
        _id: testUser._id
      }, secret);
      done();
    });
  });
  afterEach((done) => {
    //I know this was in some in class, but it's actually unnecessary
    process.env.MONGOLAB_URI = dbPort;
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('allow a user get their user info', (done) => {
    request('localhost:3000')
      .get('/user/' + testUser._id)
      .set('token', token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.username).to.eql('testuser');
        expect(res.body.password).to.eql(null);
        done();
      });
  });

  it('allow a user to DELETE themself', (done) => {
    request('localhost:3000')
      .delete('/user/' + testUser._id)
      .set('token', token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.message).to.eql('successfully deleted');
        User.findOne({
          _id: testUser._id
        }, (err, user) => {
          //if you want mocha to know about an error you either have
          //to check it with an expect or throw it.
          if (err) return err;
          //the line below doesn't do anything
          if (user) new Error;
        });
        //since this done is outside of your db call it's not waiting for
        //it to come back. This test likely doesn't do anything.
        done();
      });
  });
});
