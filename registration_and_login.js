const mongoose = require('mongoose');
mongoose.Promise = Promise;
const schema = new mongoose.Schema({username: String, password: String});
const Login = mongoose.model('Login', schema);
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
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err)
    console.log(err);
  else
    console.log('Login database connected')
});