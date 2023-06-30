'use strict'

const express = require('express');
const api = express.Router();
const additionalServicesController = require('./additionalServices.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/save', [ensureAuth, isAdmin], additionalServicesController.saveAdditionalService);
api.get('/get', ensureAuth, additionalServicesController.getAdditionalServices);
api.get ('/gets/:id', [ensureAuth, isAdmin], additionalServicesController.getAdditionalServiceId);
api.put('/update/:id', [ensureAuth, isAdmin], additionalServicesController.update);

module.exports=api;