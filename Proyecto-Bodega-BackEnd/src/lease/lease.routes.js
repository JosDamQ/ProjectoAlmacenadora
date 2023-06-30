'use strict'

const express = require('express');
const api = express.Router();
const leaseController = require('./lease.controller');
const {ensureAuth} = require('../services/authenticated');

api.post('/newLease', ensureAuth, leaseController.createLease);
api.get('/getLease/:id', ensureAuth, leaseController.getLease);
api.get('/getLeases', ensureAuth, leaseController.getLeases);
api.put('/update/:id', ensureAuth, leaseController.update);
api.delete('/delete/:id', ensureAuth, leaseController.delete);
api.put('/deleteAdditionalService/:id',  ensureAuth, leaseController.deleteAdditionalService)
api.put('/addAdditionalService/:id', ensureAuth, leaseController.addAdditionalServices)

module.exports=api;