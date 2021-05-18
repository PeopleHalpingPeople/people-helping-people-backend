'use strict'

// TODO: Install dependencies, npm i http socket.io
const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 3000;

// Possibly change to an app.use????
http.listen(PORT, () => {
  console.log(`server is up on http://localhost:${PORT}`)
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.on('message',(event) => {
    console.log(event);
    socket.broadcast.emit('message', event);
  });
});

io.on('disconnect', (event) => {
  console.log('user has left the chat');
});