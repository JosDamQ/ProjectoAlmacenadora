'use strict'

const express = require('express')
const userController = require('./user.controller')
const api = express.Router()
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/test', userController.test);
api.post('/login', userController.login);
api.post('/createUser', [ensureAuth,isAdmin], userController.createUser)
api.get('/getUsers', ensureAuth, userController.getUsers)
api.get('/getUser/:id', [ensureAuth,isAdmin], userController.getUser)
api.put('/updateUser/:id', [ensureAuth,isAdmin], userController.updateUser)
api.delete('/deleteUser/:id', [ensureAuth,isAdmin], userController.deleteUser)
api.post('/addWorker', [ensureAuth,isAdmin], userController.addWorker)
api.get('/getWorkers', [ensureAuth,isAdmin], userController.getWorkers)
api.get('/getWorker/:id', [ensureAuth,isAdmin], userController.getWorker)
api.put('/updateWorker/:id', [ensureAuth,isAdmin], userController.updateWorker)
api.put('/updatePasswordWorker/:id', [ensureAuth,isAdmin], userController.updatePasswordWorker)
api.delete('/deleteWorker/:id', [ensureAuth,isAdmin], userController.deleteWorker)

api.get('/getRol', [ensureAuth], userController.confirmRol)

module.exports = api;