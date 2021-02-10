// Importing modules
const Message = require('./models/schema.js')
const express = require('express');
const app = express();
const https = require('http').Server(app);
const socketio = require('socket.io')(https);
const mongoose = require('mongoose');
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
// Creating a promise, and message model for mongoose
//mongoose.Promise = Promise;
//const dbUrl = 'mongodb+srv://v01d13:AZJZJMaw87qX1oYa@chatapp-mongo.dqlry.mongodb.net/<dbname>?retryWrites=true&w=majority';
// Socket connection on connected
socketio.on('connection', (user, socket) => {
  console.log(`${socket.sid} connected`);
  //Placeholder for unseen messages
  // await Message.find({username: user}, (err, messages) => {
  //   if (err)
  //     return console.error(err);
  //   else
  //     try {
  //       var json_parse = JSON.parse(JSON.stringify(messages));
  //       for (var i = 0; i < json_parse.length; i++) {
  //        var json_obj = json[i];
  //          if(json_obj.seen == false)
  //            socket.emit('unseen_message', JSON.stringify(json_object));
  //       }
  //       socket.emit("initial_message", json_parse);
  //     }
  //     catch (err) {
  //       console.error(err);
  //     }
  //   }).lean().exec();
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
socketio.on('send_message', (data) => {
  console.log(data.user);
  console.log(data.message);
  // Message.save( (err) => {
  //   if(err)
  //     console.error(err);
  //   else
  //     console.log('New database entry.');
  // });
  socket.broadcast.emit("receive_message", data);
});
// Private message for future//
socketio.on('private_message', (socket) => {
  app.get(username, (req, res) => {
    // Message.find({username: "Suresh"}, (err, messages) => {
    //   if (err)
    //     return console.error(err);
    //   else
    //     try {
    //       var json_parse = JSON.stringify(messages);
    //       socket.emit(json_parse);
    //     }
    //     catch (err) {
    //     console.error(err);
    //     }
    // }).lean().exec();
  });
});
// // Mongoose connecting to mlab database
// mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//   if (err)
//     console.log(err);
//   else
//     console.log('Database connected')
// });