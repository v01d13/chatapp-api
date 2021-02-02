const app = require('express')()
const https = require('http').createServer(app)

app.get('/', (req, res) => {
    res.send("Node Server is test running!!");
    console.log(`Get`);
});

//Socket Logic
const socketio = require('socket.io')(https)

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data);
        console.log(data);
    })
});

socketio.on('clientError', (err, socket) => {
  console.error(err);
  socketio.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
socketio.on('disconnect', () => {
  console.log(`disconnected`);
});

https.listen( 3000, '192.168.1.3', (req, res) => {
  console.log(https.address());
});
console.log('Listening');