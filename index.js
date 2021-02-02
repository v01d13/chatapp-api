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
    socketio.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data);
        console.log('Sent');
    })
});

socketio.on('clientError', (err, socket) => {
  console.error(err);
  socketio.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
socketio.on('disconnect', () => {
  console.log(`disconnected`);
});

https.listen(9000, '192.168.1.3', (req, res) => {
  console.log(https.address());
});
console.log('Listening');