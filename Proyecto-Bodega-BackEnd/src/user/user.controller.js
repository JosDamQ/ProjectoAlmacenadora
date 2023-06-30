'use strict'

const User = require('./user.model');
const Lease = require('../lease/lease.model')
const {encrypt, validateData} = require('../utils/validate');
const { compare } = require('bcrypt');
const {createToken} = require('../services/jwt');

exports.test = (req, res)=>{
  return res.status(201).send({message: 'User test running'});
}

exports.adminDefault = async(req, res)=>{
  try {
    let adminDefault = {
      name: 'User',
      surname: 'default',
      email: 'admin',
      password: 'admin',
      phone: '12021202',
      rol: 'ADMIN'
    }
    let user = await User.findOne({email: 'admin'})
    if(user) return console.log('Admin already exists')
    adminDefault.password = await encrypt(adminDefault.password)
    let newAdmin = new User(adminDefault)
    await newAdmin.save()
    return console.log('Admin default was created')
  } catch (err) {
    return console.log(err);
  }
}

exports.confirmRol = async(req, res)=>{
  try {
    return res.status(200).send({user: req.user});
  } catch (err) {
    console.log(err);
  }
}

// Login
exports.login = async(req, res)=>{
  try {
    let data = req.body
    let user = await User.findOne({email: data.email});
    if(!data.password) return res.status(500).send({message: 'Password is required'});
    if(user && await compare(data.password, user.password)){
      if(user.rol != 'ADMIN' && user.rol != 'WORKER')
        return res.status(500).send({message: `You don't have permissions`})
      let token = await createToken(user)
      let userLogged = {
        email: user.email,
        rol: user.rol
      }
      return res.send({ message: 'User logged successfully', token, userLogged });
    }
    return res.status(404).send({message: 'Invalid credentials'});
  } catch (err) {
    console.log(err);
  }
}

//Gestion de usuario
exports.createUser = async(req, res)=>{
  try {
    let data = req.body
    if(data.email || data.email == '') return res.send({message: 'Email is not allowed'})
    if(data.password || data.password == '') return res.send({message: 'Password is not allowed'})
    data.rol = 'CLIENT';
    let newUser = new User(data);
    await newUser.save()
    return res.status(201).send({message: 'User saved successfully'});
  } catch (err) {
    console.log(err);
  }
}

exports.getUsers = async(req, res)=>{
  try {
    let users = await User.find({rol: 'CLIENT'})
    return res.status(201).send({users})
  } catch (err) {
    console.log(err);
  }
}

exports.getUser = async(req, res)=>{
  try {
    let userId = req.params.id;
    let user = await User.findOne({_id: userId, rol: 'CLIENT'});
    if(!user) return res.status(404).send({message: 'User not found'});
    return res.status(201).send({user})
  } catch (err) {
    console.log(err);
  }
}

exports.updateUser = async(req, res)=>{
  try {
    let data = req.body;
    if(data.email || data.email == '') return res.send({message: 'Email is not allowed'})
    if(data.password || data.password == '') return res.send({message: 'Password is not allowed'})
    if(data.rol || data.rol == '') return res.send({message: 'Rol is not allowed'})
    let params = {
      name: data.name,
      surname: data.surname,
      phone: data.phone
    }
    let msg = validateData(params)
    if(msg) return res.status(400).send({msg})
    let userId = req.params.id;
    let userUpdated = await User.findOneAndUpdate({_id: userId, rol: 'CLIENT'}, data, {new: true});
    if(!userUpdated) return res.status(404).send({message: 'User not found'});
    return res.status(201).send({userUpdated});
  } catch (err) {
    console.log(err);
  }
}

exports.deleteUser = async(req, res)=>{
  try {
    let userId = req.params.id
    let usingUser = await Lease.findOne({user: userId})
    if(usingUser) return res.status(400).send({message: 'User has a lease'});
    let userExists = await User.findOneAndDelete({_id: userId, rol: 'CLIENT'});
    if(!userExists) return res.status(404).send({message: 'User not found and not deleted'})
    return res.status(404).send({message: 'User deleted successfully'})
  } catch (err) {
    console.log(err);
  }
}

//Gestion de trabajador
exports.addWorker = async(req, res)=>{
  try {
    let params = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      rol: 'WORKER'
    }
    let msg = validateData(params)
    if(msg) return res.status(400).send({msg});
    let user = await User.findOne({email: params.email, rol: 'WORKER'});
    if(user) return res.status(500).send({message: 'User with this email already exists'});
    params.password = await encrypt(params.password)
    let newWorker = new User(params);
    await newWorker.save()
    return res.status(201).send({message: 'Worker saved successfully'})
  } catch (err) {
    console.log(err);
  }
}

exports.getWorkers = async(req, res)=>{
  try {
    let workers = await User.find({rol: 'WORKER'}, {password: 0});
    return res.status(201).send({workers})
  } catch (err) {
    console.log(err);
  }
}

exports.getWorker = async(req, res)=>{
  try {
    let workerId = req.params.id;
    let worker = await User.findOne({_id: workerId, rol: 'WORKER'}, {password: 0});
    if(!worker)return res.status(201).send({message: 'Worker not found'})
    return res.status(201).send({worker})
  } catch (err) {
    console.log(err);
  }
}

exports.updateWorker = async(req, res)=>{
  try {
    let workerId = req.params.id
    let params = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      phone: req.body.phone
    }
    let msg = validateData(params)
    if(msg) return res.status(400).send({msg});
    let workerUpdated = await User.findOneAndUpdate({_id: workerId, rol: 'WORKER'}, params, {new: true}).lean()
    if(!workerUpdated) return res.status(404).send({message: 'Worker not found'});
    delete workerUpdated.password;
    return res.status(201).send({workerUpdated})
  } catch (err) {
    console.log(err);
  }
}

exports.updatePasswordWorker = async(req, res)=>{
  try {
    let workerId = req.params.id
    let params = {
      before: req.body.before,
      after: req.body.after
    }
    let msg = validateData(params)
    if(msg) return res.status(400).send({msg});
    let user = await User.findOne({_id: workerId, rol: 'WORKER'});
    if (!user) return res.status(404).send({message: 'Worker not found'});
    params.after = await encrypt(params.after)
    if(await compare(params.before, user.password)){
      await User.findOneAndUpdate(
        {_id: workerId, rol: 'WORKER'},
        {password: params.after},
        {new: true}
      )
      return res.status(201).send({message: 'Password was updated'})
    }
    return res.send({message: 'Invalid Password'});
  } catch (err) {
    console.log(err);
  }
}

exports.deleteWorker = async(req, res)=>{
  try {
    let workerId = req.params.id;
    let userDeleted = await User.findOneAndDelete({_id: workerId, rol: 'WORKER'});
    if(!userDeleted) return res.status(404).send({message: 'Worker not found'});
    return res.status(201).send({userDeleted})
  } catch (err) {
    console.log(err);
  }
}