'use strict';

const chai = require('chai');
const expect = chai.expect;
const getStops = require('./../lib/get-stops');

describe('Get stops unit testing', () => {
  //since there's only the one test I would have just done this in the
  //test block itself rather than in a before.
  let req = {};
  req.latLon =  {lat: 47.61156, lng: -122.327618};
  let sampleResponse = {};
  before((done) => {
    getStops(req, sampleResponse, done);
  });
  it('should have returned our stops object with routes objects attached', () => {
    expect(req.stopsList[0].routeIds[0]).to.have.property('shortName');
    expect(req.stopsList[1].routeIds[0]).to.have.property('longName');
    expect(req.stopsList[1].routeIds[0]).to.have.property('id');
    expect(req.stopsList[2].routeIds[0]).to.have.property('description');
  });
});
