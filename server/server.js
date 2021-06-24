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
    console.log('EVENT', event);
    users.push(event); 
    const allMessages = await Chat.find({ });
    console.log('SOCKET ID', users)
    users[event] = event.socketID;
    socket.emit('message list', { currentUser: event, allMessages });
  });
  

  socket.on('message1',(event) => {
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
      console.log('message saved to DB');
    })
    console.log('EVENT', message);
    io.to(users[message.privateReceiver]).emit('private message', message);
    console.log('privateEVENT--', message);
    socket.emit('message', message);
  });

  socket.on('disconnect', (event) => {
    console.log('user has left the chat');
    return event;
  });
  
});

