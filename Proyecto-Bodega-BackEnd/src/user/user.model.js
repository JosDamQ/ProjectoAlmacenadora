"use strict";

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String
  },
  phone: {
    type: String, 
    required: true
  },
  rol: {
    type: String,
    upperCase: true,
    required: true
  },
});

module.exports = mongoose.model("User", userSchema);
