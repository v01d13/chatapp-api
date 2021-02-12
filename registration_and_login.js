const sql = require('mssql');
const md5 = require('md5');
const dbOperations = require('./dbOperations');

module.exports.login = async (user, passwd) => {

  // await sql.query(``), (err) =>  {
  //   if (err)
  //     return false;
  //   else
  //     console.log('User logged in');
  //     return true;
  // }
}
    
    module.exports.registration = async(newUser) => {
      
  await dbOperations.checkUserName(newUser.userName);
  
  
  // console.log(data.name)
  // await sql.query(``), (err => {
  //   if (err) {
  //     console.error(err);
  //     return false;
  //   }
  //   else {
  //     console.log('New user added.');
  //     return true
  //   }
  // });
};