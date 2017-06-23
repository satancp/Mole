'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ufileCtrlStub = {
  index: 'ufileCtrl.index',
  show: 'ufileCtrl.show',
  create: 'ufileCtrl.create',
  upsert: 'ufileCtrl.upsert',
  patch: 'ufileCtrl.patch',
  destroy: 'ufileCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ufileIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ufile.controller': ufileCtrlStub
});

describe('Ufile API Router:', function() {
  it('should return an express router instance', function() {
    expect(ufileIndex).to.equal(routerStub);
  });

  describe('GET /api/ufiles', function() {
    it('should route to ufile.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'ufileCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/ufiles/:id', function() {
    it('should route to ufile.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'ufileCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/ufiles', function() {
    it('should route to ufile.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'ufileCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/ufiles/:id', function() {
    it('should route to ufile.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'ufileCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ufiles/:id', function() {
    it('should route to ufile.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'ufileCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ufiles/:id', function() {
    it('should route to ufile.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'ufileCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
