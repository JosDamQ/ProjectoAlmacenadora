'use strict'

const mongoose = require ('mongoose')

const storageSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    }

},{
    versionKey: false
})

module.exports = mongoose.model('Storage', storageSchema)