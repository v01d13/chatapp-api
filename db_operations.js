const sql = require("mssql");
const dbConfig = require("./dbConfig");

var pool;
const poolFunction = async function () {
  try {
    pool = new sql.ConnectionPool(dbConfig);
    console.log("Database is connected succesfully");
  } catch (error) {
    console.log("THe error is ", error);
  }
};

module.exports.checkUserName = async (userName) => {
  try {
    await poolFunction();
    await pool.connect();
    var newReq = new sql.Request(pool);
    var result = await newReq
      .input("input_parameter", sql.VarChar, userName)
      .query(
        "SELECT userName FROM userTable where userName = @input_parameter"
      );
    const strings = result.rowsAffected[0];
    return strings;
  } catch (error) {
    throw error;
  }
  // sql.input('userName',sql.VarChar,userName);
};
module.exports.checkEmail = async (email) => {
  try {
    await poolFunction();
    await pool.connect();
    var newReq = new sql.Request(pool);
    var result = await newReq
      .input("input_parameter", sql.VarChar, email)
      .query("SELECT email FROM userTable where email = @input_parameter");
    const strings = result.rowsAffected[0];
    return strings;
  } catch (error) {
    throw error;
  }
  // sql.input('userName',sql.VarChar,userName);
};

module.exports.addUserToDatabase = async (newUser) => {
  try {
    await poolFunction();
    await pool.connect();
    var newReq = new sql.Request(pool);
    newReq.input("userName", sql.VarChar, newUser.userName);
    newReq.input("email", sql.VarChar, newUser.email);
    newReq.input("dob", sql.Date, newUser.dob);
    newReq.input("gender", sql.VarChar, newUser.gender);
    newReq.input("userPassword", sql.VarChar, newUser.userPassword);
    var result = await newReq.query(
      "INSERT INTO userTable(userName,dob,gender,userPassword,email) values (@userName,@dob,@gender,@userPassword,@email)"
    );
    console.log(result);
    const strings = result.rowsAffected[0];
    return strings;
  } catch (error) {
    throw error;
  }
  // INSERT INTO userTable(userName,dob,gender,userPassword,email) values ('suressdh','2000/11/28','male','sureshisvu','aatitkarkeei@gmail.com');
  // await sql.query("SELECT * FROM userTable");
};
module.exports.checkLoginDetails= async (userName,userPassword) => {
  try {
    await poolFunction();
    await pool.connect();
    var newReq = new sql.Request(pool);
    newReq.input("userName", sql.VarChar, userName);
    newReq.input("userPassword", sql.VarChar, userPassword);
    var result = await newReq.query(
      "SELECT * FROM userTable WHERE userName=@userName AND userPassword=@userPassword"
    );
    console.log(result);
    const strings = result.rowsAffected[0];
    return strings;
  } catch (error) {
    throw error;
  }
  // INSERT INTO userTable(userName,dob,gender,userPassword,email) values ('suressdh','2000/11/28','male','sureshisvu','aatitkarkeei@gmail.com');
  // await sql.query("SELECT * FROM userTable");
};

module.exports.poolFunction = poolFunction;
