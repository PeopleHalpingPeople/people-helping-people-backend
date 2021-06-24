'use strict'

const mongoose = require('mongoose');
const Chat = require('./chat-schema.js');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const mongoDB = process.env.MONGODB;
// const http = require('http').createServer();
// const io = require('socket.io')(http);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;

let users = [];

mongoose.connect(mongoDB, { useNewParser: true, useUnifiedTopology: true }).then(() => {
  console.log('mongoDB is connected');
}).catch(err => console.log(err));

// http.listen(PORT, () => {
//   console.log(`server is up on http://localhost:${PORT}`)
// });
const io = new Server(PORT, {cors: {origin: ['http://localhost:3001']}})


io.on('connection', (socket) => {
  console.log('connected')
  
  socket.on('add user', async (event) => {
    console.log(event);
    users.push(event); 
    const allMessages = await Chat.find({ });
    users[event] = event.socketID;
    socket.emit('message list', { currentUser: event, allMessages });
  });
  

  socket.on('message',(event) => {
    console.log('USER EVENT', event);
    const message = new Chat( event );
    message.save().then(() => {
      io.emit('message saved to db');
    })
    console.log('MESS',message);
    socket.emit('message', message);
  });

  socket.on('private message', (event) => {
    const message = new Chat( event );
    message.save().then(() => {
      io.emit('message saved to db');
    })
    io.to(users[event.privateReceiver]).emit('private message', event);
    socket.emit('private message', event);
  });

  socket.on('disconnect', (event) => {
    console.log('user has left the chat');
    return event;
  });
  
});

