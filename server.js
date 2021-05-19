'use strict'

// TODO: Install dependencies, npm i http socket.io
const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 3000;

let users = [];

http.listen(PORT, () => {
  console.log(`server is up on http://localhost:${PORT}`)
})

io.on('connection', (socket) => {
  socket.on('add user', (event) => {
    users.push(event.username); 
    users[event.username] = event.socketID;
  })
  console.log('connected')
  socket.on('message',(event) => {
    console.log('event---', event);
    socket.broadcast.emit('message', event);
    
  });
  socket.on('private message', (event) => {
    io.to(users[event.privateReceiver]).emit('private message', event);
    // use message type from line 46 client.js to access the users object
    
    // TODO add in third variable to .on private message
    console.log('PM event---', event);
    socket.emit('private message', event);
  })
});

io.on('disconnect', (event) => {
  console.log('user has left the chat');
  return event;
});