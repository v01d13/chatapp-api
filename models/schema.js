const mongoose = require('mongoose');
loginSchema = mongoose.Schema({username: String, password: String});
module.exports.LoginSchema = mongoose.model('Login', loginSchema);
schemaMessage = mongoose.Schema({username: String, message: String, seen: Boolean}, {timestamps: true});
module.exports.Message = mongoose.model('Message', schemaMessage);
schemaRegistration = mongoose.Schema({username: String, password: String, email: String});
module.exports.Registration = mongoose.model('Registration', schemaRegistration);