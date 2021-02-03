var express = require('express');
var app = express();
var https = require('http').Server(app);
var socketio = require('socket.io')(https);

app.get('/', (req, res) => {
    res.send("Node Server is test running!!");
    console.log(`Get`);
});

socketio.on('connection', (socket) => {
    console.log('user connected')
    socket.on('send_message', (data) => {
      var obj = { message: data, chatType:'receive' };
      var myJSON = JSON.stringify(obj);
      console.log(data);
        socket.broadcast.emit("receive_message", obj);
    });

    socket.on('chat', (msg) => {
      console.log('message: ' + msg);
    });
});

socketio.on('clientError', (err, socket) => {
  console.error(err);
  socketio.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
socketio.on('disconnect', () => {
  console.log(`disconnected`);
});

https.listen(4559, (req, res) => {
  console.log(https.address());
});
console.log('Listening');