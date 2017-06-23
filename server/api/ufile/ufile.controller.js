/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ufiles              ->  index
 * POST    /api/ufiles              ->  create
 * GET     /api/ufiles/:id          ->  show
 * PUT     /api/ufiles/:id          ->  upsert
 * PATCH   /api/ufiles/:id          ->  patch
 * DELETE  /api/ufiles/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Ufile from './ufile.model';
import fs from 'fs';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Ufiles
export function index(req, res) {
  return Ufile.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Ufile from the DB
export function show(req, res) {
  return Ufile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Ufile in the DB
export function create(req, res) {
  return Ufile.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Uploads the file
export function upload(req, res) {
  if(Array.isArray(req.files.file) == true) {
    for(var i = 0; i < req.files.file.length; i++) {
      fs.createReadStream(req.files.file[i].path).pipe(fs.createWriteStream(`./upload/${req.files.file[i].name}`));
    }
    res.end('Finished');
  } else {
    fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(`./upload/${req.files.file.name}`));
    res.end('Finished');
  }
}

// Upserts the given Ufile in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Ufile.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Ufile in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Ufile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Ufile from the DB
export function destroy(req, res) {
  return Ufile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
