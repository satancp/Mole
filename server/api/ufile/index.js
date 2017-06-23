'use strict';

var express = require('express');
var controller = require('./ufile.controller');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/upload/', multipartyMiddleware, controller.upload);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
