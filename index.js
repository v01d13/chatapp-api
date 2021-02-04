// Importing modules
var express = require('express');
var app = express();
var https = require('http').Server(app);
var socketio = require('socket.io')(https);
var mongoose = require('mongoose');
var firebaseAdmin = require('firebase-admin');

//
app.get('/', (req, res) => {
    res.send("Node Server is test running!!");
    console.log(`Get`);
});
//Creating a promise, and message model for mongoose
mongoose.Promise = Promise;
var dbUrl = 'mongodb+srv://v01d13:wFYQrplPbOqDf6tG@chat-app-mongo.dqlry.mongodb.net/<dbname>?retryWrites=true&w=majority';
var Message = mongoose.model('Message', {
    username: String,
    message: String
});
//Socket connection on connected
socketio.on('connection', async (socket) => {
  console.log('User connected');
  await Message.find((err, data) => {
    if(err)
      console.error(err);
    else
    
    // var stringdata = JSON.stringify(data);
    console.log(typeof data);
    // console.log(data);
      socket.emit("initial_message", data);
  });
});
//Socket connection error
socketio.on('clientError', (err, socket) => {
  console.error(err);
  socketio.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
//socket on disconnect
socketio.on('disconnect', (client) => {
  socketio[client].disconnect();
  console.log(`User disconnected`);
});
//HTTPS server
https.listen(3000, '192.168.1.92', (req, res) => {
  console.log('Listening: ', https.address());
});
socketio.on('send_message', (data) => {
    console.log(data.user);
    console.log(data.message);
    var mongoose_data = new Message({username: data.user, message: data.message});
    mongoose_data.save( (err) => {
      if(err)
        console.error(err);
      else
        console.log('New database entry.');
    });
    socket.broadcast.emit("receive_message", data);
  });
//Mongoose connecting to mlab database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err)
        console.log(err);
    else
        console.log('Database connected')
});