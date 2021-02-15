const sql = require("mssql");
const md5 = require("md5");
const dbOperations = require("./dbOperations");

module.exports.login = async (userName, password) => {
  try{
    var resultData = await dbOperations.checkLoginDetails(userName,password);
    if(resultData==0){
      throw "Wrong username/password cannot Login"
    }else{
      return resultData;
    }
  }catch (error) {
    throw error;
  }
};

module.exports.registration = async (newUser) => {
  try {
    var userNameExists= await dbOperations.checkUserName(newUser.userName);
    if(userNameExists==1){
      throw "Sorry this username is not available"
    }
    var emailExists = await dbOperations.checkEmail(newUser.email);
    if(emailExists==1){
      throw "email is already registered"
    }
    console.log("The date is as: "+ newUser.dob);
      var result = await dbOperations.addUserToDatabase(newUser );
    return result;
  } catch (error) {
    throw error;
  }

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
