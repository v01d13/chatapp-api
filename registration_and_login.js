import {Login, Registration} from './models/schema.js';
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Login = new Login();
const Registration = new Registration();
module.exports.login = async (user, passwd) => {
  await Login.find({username: user}, (err, details) => {
    if (err)
      return console.error(err);
    else
      try {
        var json_parse = JSON.parse(JSON.stringify(details));
        var pw = (json_parse.password).toString;
        if (pw.localeCompare(passwd))
          return true
        else 
          return false
      }
      catch (err) {
        return console.error(err);
      }
  }).lean().exec();
};
module.exports.registration = async() => {
  await Registration.save(err => {
    if (err) {
      console.error(err);
      return false;
    }
    else {
      console.log('New user added.');
      return true
    }
  });
};
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err)
    console.log(err);
  else
    console.log('Login database connected')
});