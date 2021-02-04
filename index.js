// Importing modules
var express = require('express');
var app = express();
var https = require('http').Server(app);
var socketio = require('socket.io')(https);
var mongoose = require('mongoose');
var enforce = require('express-sslify');
//
app.get('/', (req, res) => {
  res.send("Node Server is test running!!");
});
app.use(enforce.HTTPS());
// Creating a promise, and message model for mongoose
mongoose.Promise = Promise;
var dbUrl = 'mongodb+srv://v01d13:wFYQrplPbOqDf6tG@chat-app-mongo.dqlry.mongodb.net/<dbname>?retryWrites=true&w=majority';
var Message = mongoose.model('Message', {
  username: String,
  message: String
});
// Socket connection on connected
socketio.on('connection', async (socket) => {
  console.log('User connected');
  await Message.find().lean(), (err,data) => {
    if(err)
      console.error(err);
    else
      var json_parse = JSON.parse(data);
      socket.emit('initial_message_load', json(json_parse));
  };
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
  var mongoose_data = new Message({username: data.user, message: data.message});
  mongoose_data.save( (err) => {
    if(err)
      console.error(err);
    else
      console.log('New database entry.');
  });
  socket.broadcast.emit("receive_message", data);
});
// Mongoose connecting to mlab database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err)
    console.log(err);
  else
    console.log('Database connected')
});