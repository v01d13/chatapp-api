const sql = require('mssql');
const dbConfig = require('./dbConfig');

var pool;
module.exports.pool =async function(){
 try{
  pool = await new  sql.ConnectionPool(dbConfig);
console.log("Database is connected succesfully") 
} catch(error){
  console.log("THe error is ",error);
 }}


module.exports.checkUserName = async(userName)=>{
  await pool.connect(async()=>{
    var result = await pool.query("SELECT * FROM userTable where userName = '${userName}'",[userName]);
   return result[0]; 
   });
  // sql.input('userName',sql.VarChar,userName);
    
    }

module.exports.addUserToDatabase = async (userName,email,gender,dob,password)=>{
  
    await sql.query("SELECT * FROM userTable");

} 