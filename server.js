'use strict'

const mongoose = require('mongoose');
const Chat = require('./chat-schema.js');
const mongoDB = 'mongodb+srv://user1:mongoATLAS1@cluster0.eleyp.mongodb.net/peopleHelping?retryWrites=true&w=majority';
const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 3000;

let users = [];

mongoose.connect(mongoDB, { useNewParser: true, useUnifiedTopology: true }).then(() => {
  console.log('mongoDB is connected');
}).catch(err => console.log(err));

http.listen(PORT, () => {
  console.log(`server is up on http://localhost:${PORT}`)
})

io.on('connection', (socket) => {

  socket.on('add user', async (event) => {
    users.push(event.username); 
    const allMessages = await Chat.find({ });
    users[event.username] = event.socketID;
    socket.emit('message list', { currentUser: event.username, allMessages });
  })
  console.log('connected')
  socket.on('message',(event) => {
    console.log('event---', event);
    socket.broadcast.emit('message', event);
    
  });
  socket.on('private message', (event) => {
    io.to(users[event.privateReceiver]).emit('private message', event);
    console.log('PM event---', event);
    socket.emit('private message', event);
  })

  socket.on('chat message', (event) => {
    const message = new Chat( event );
    message.save().then(() => {
      io.emit('message saved to db');
    })
  })
});

io.on('disconnect', (event) => {
  console.log('user has left the chat');
  return event;
});