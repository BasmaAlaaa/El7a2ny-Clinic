const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const AdminSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },  
  Password: {
    type: String,
    required: true,
  }
  }, { timestamps: true });

module.exports = mongoose.model('Administrator', AdminSchema);