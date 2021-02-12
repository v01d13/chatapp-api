// Importing modules
const express = require('express');
const app = express();
const https = require('http').Server(app);
const socketio = require('socket.io')(https);
const enforce = require('express-sslify');
const sql = require('mssql');
const { SSL_OP_NO_QUERY_MTU } = require('constants');
const registration_and_login = require('./registration_and_login');
const md5 = require('md5');
const User = require('./models/user');
const {pool} = require('./dbOperations');

pool()
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())
app.get('/', (req, res) => {
  res.send("Https test!!");
});

app.post('/signup',async (req,res)=>{
  // try{
  const userName =req.body.userName;
  const email=req.body.email
  const dob= req.body.dob
  const gender = req.body.gender
  const userPassword =  req.body.userPassword
  if(!userName || !email || !dob || !gender || !userPassword) return res.send({message:"Fill up all the fields"})
  const password = md5(userPassword);
  let newUser = new User(userName,email,dob,gender,password);
  await  registration_and_login.registration(newUser);

  // }catch(error){
  //   res.send({error: error})
  // }
  

});


app.use(enforce.HTTPS());

// Socket connection on connected
socketio.on('connection', (user, socket) => {
  console.log(`${socket.sid} connected`);
});
// Socket connection error
socketio.on('clientError', (err, socket) => {
  console.error(err);
  socketio.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
// Socket on disconnect
socketio.on('disconnect', (client) => {
  socketio[client].disconnect();
  console.log(`User disconnected`);
});
// HTTPS server
https.listen(process.env.PORT || 5000, (req, res) => {
  console.log('Listening: ', https.address());
});
socketio.on('send_message', async(data) => {
  await sql.query(`insert into message (message,toUser,fromUser) values (${data.message}, ${data.toUser}, ${data.fromUser})`)
  console.log(data.toUser);
  console.log(data.message);
});
// Private message for future//
socketio.on('private_message', async(username) => {
  const query_result = await sql.query(`select * from message where toUser = ${username}`);
  console.log(query_result)
});