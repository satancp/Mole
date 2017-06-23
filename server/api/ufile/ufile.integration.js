'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newUfile;

describe('Ufile API:', function() {
  describe('GET /api/ufiles', function() {
    var ufiles;

    beforeEach(function(done) {
      request(app)
        .get('/api/ufiles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ufiles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(ufiles).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/ufiles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ufiles')
        .send({
          name: 'New Ufile',
          info: 'This is the brand new ufile!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUfile = res.body;
          done();
        });
    });

    it('should respond with the newly created ufile', function() {
      expect(newUfile.name).to.equal('New Ufile');
      expect(newUfile.info).to.equal('This is the brand new ufile!!!');
    });
  });

  describe('GET /api/ufiles/:id', function() {
    var ufile;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ufiles/${newUfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ufile = res.body;
          done();
        });
    });

    afterEach(function() {
      ufile = {};
    });

    it('should respond with the requested ufile', function() {
      expect(ufile.name).to.equal('New Ufile');
      expect(ufile.info).to.equal('This is the brand new ufile!!!');
    });
  });

  describe('PUT /api/ufiles/:id', function() {
    var updatedUfile;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ufiles/${newUfile._id}`)
        .send({
          name: 'Updated Ufile',
          info: 'This is the updated ufile!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUfile = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUfile = {};
    });

    it('should respond with the updated ufile', function() {
      expect(updatedUfile.name).to.equal('Updated Ufile');
      expect(updatedUfile.info).to.equal('This is the updated ufile!!!');
    });

    it('should respond with the updated ufile on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ufiles/${newUfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ufile = res.body;

          expect(ufile.name).to.equal('Updated Ufile');
          expect(ufile.info).to.equal('This is the updated ufile!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ufiles/:id', function() {
    var patchedUfile;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ufiles/${newUfile._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Ufile' },
          { op: 'replace', path: '/info', value: 'This is the patched ufile!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUfile = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUfile = {};
    });

    it('should respond with the patched ufile', function() {
      expect(patchedUfile.name).to.equal('Patched Ufile');
      expect(patchedUfile.info).to.equal('This is the patched ufile!!!');
    });
  });

  describe('DELETE /api/ufiles/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ufiles/${newUfile._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ufile does not exist', function(done) {
      request(app)
        .delete(`/api/ufiles/${newUfile._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
