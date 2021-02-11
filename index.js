// Importing modules
const express = require('express');
const app = express();
const https = require('http').Server(app);
const socketio = require('socket.io')(https);
const enforce = require('express-sslify');
const sql = require('mssql');
const { SSL_OP_NO_QUERY_MTU } = require('constants');
const config = {
  user: 'chatadmin',
  password: 'Suresh111',
  server: 'mychatappserver.database.windows.net',
  port: 1433,
  database: 'ChatApp',
  connectionTimeout: 3000,
  parseJSON: true,
  options: {
    encrypt: true,
    enableArithAbort: true
  },
  pool: {
    min: 0,
    idleTimeoutMillis: 3000
  }
};
//
app.get('/', (req, res) => {
  res.send("Https test!!");
});
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect((err) => {
  if (err) return console.error(err);
  else return console.log('Database connected');
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
https.listen(process.env.PORT || 3000, (req, res) => {
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