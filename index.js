const app = require('express')()
const https = require('https').createServer(app)


app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
});

//Socket Logic
const socketio = require('socket.io')(https)

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
    })
});

socketio.on('clientError', (err, socket) => {
  console.error(err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

socketio.on('disconnect', () => {
  console.log(`disconnected`);
});

https.listen(process.env.PORT || 3000, function() {
});
console.log('Listening');