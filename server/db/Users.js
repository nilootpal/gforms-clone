const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdForms: []
 }, {timestamps: true});

UserSchema.plugin(mongoosePaginate);

const Users = new mongoose.model('User', UserSchema, 'Users');
module.exports = Users;