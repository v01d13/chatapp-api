const sql = require('mssql');

module.exports.login = async (user, passwd) => {
  await sql.query(``), (err) =>  {
    if (err)
      return false;
    else
      console.log('User logged in');
      return true;
  }
}
    
module.exports.registration = async() => {
  await sql.query(``), (err => {
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