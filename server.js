'use strict'

// TODO: Install dependencies, npm i http socket.io
const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 3000;

let users = [];

// Possibly change to an app.use????
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
    console.log(event);
    socket.broadcast.emit('message', event);
    
  });
  socket.on('private message', (event) => {
    io.to(users['']).emit('private message', event);
    // use the third parameter to access the users object this comes from 38 client.js
    console.log(event);
    socket.emit('private message', event);
  })
});

io.on('disconnect', (event) => {
  console.log('user has left the chat');
  return event;
});