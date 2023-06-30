'use strict'

const express = require('express');
const api = express.Router()
const storageController = require('./storage.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/save', [ensureAuth, isAdmin], storageController.addStorage);
api.get('/get', ensureAuth, storageController.getStorages);
api.post('/getByName', [ensureAuth, isAdmin], storageController.searchByNameStorage);
api.get('/getAvailables', [ensureAuth, isAdmin], storageController.getAvailables);
api.get('/getById/:id', [ensureAuth, isAdmin], storageController.searchById);
api.put('/update/:id', [ensureAuth, isAdmin], storageController.updateStorage);
api.delete('/delete/:id', [ensureAuth, isAdmin], storageController.deleteStorage);

module.exports = api