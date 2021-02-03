// Importing modules
var express = require('express');
var app = express();
var https = require('https').Server(app);
var socketio = require('socket.io')(https);
var mongoose = require('mongoose');
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
socketio.on('connection', (socket) => {
  console.log('user connected');
  socket.on('send_message', (user, data) => {
    console.log(user, data);
    var mongoose_data = new Message({username: user, message: data});
    mongoose_data.save( (err) => {
      if(err)
        console.error(err);
      else
        console.log('New database entry.')
    });
    socket.broadcast.emit("receive_message", data);
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
https.listen(process.env.PORT || 3000, (req, res) => {
  console.log('Listening: ', https.address());
});
//Mongoose connecting to mlab database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err)
        console.log(err);
    else
        console.log('Database connected')
});