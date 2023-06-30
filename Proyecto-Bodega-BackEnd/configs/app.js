'use strict'

const express = require('express');
const morgan = require ('morgan');
const helmet = require ('helmet');
const cors = require ('cors');
const app = express();
const port = process.env.PORT || 3000;
const additionalServicesRoutes = require ('../src/additionalServices/additionalServices.routes');
const userRoutes = require('../src/user/user.routes');
const userController = require('../src/user/user.controller');
const storageRoutes = require("../src/storages/storage.routes")
const leaseRoutes = require("../src/lease/lease.routes")

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/additionalServices', additionalServicesRoutes);
app.use('/user', userRoutes)
app.use('/storage', storageRoutes)
app.use('/lease', leaseRoutes)

exports.initServer = ()=>{
    app.listen(port);
    userController.adminDefault()
    console.log(`Server http running in port ${port}`);
}