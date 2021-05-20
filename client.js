'use strict';

const socket = require('socket.io-client')(process.env.PORT || 'http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
const { argv, emit } = require('process');
// const messages = document.getElementById('messages');
// const msgForm = document.getElementById('msgForm');
let username = null;

socket.on('disconnect', () => {
  console.log('disconnected');
})

socket.on('connect', () => {
  console.log(chalk.red('---- Start Chatting ----'))
  username = process.argv[2];
  socket.emit('add user', { username, socketID: socket.id })
});

socket.on('message', (data) => {
  const { User_Message, username } = data;
  console.log(chalk.green(username + ':' + User_Message.split('\n')[0]));
  socket.emit('chat message', data)
})

socket.on('private message', (data) => {
  const { User_Message, username } = data;
  console.log(chalk.yellow(username + ':' + User_Message.split('\n')[0]));
  socket.emit('chat message', data)
});

socket.on('message list', (data) => {
  data.allMessages.forEach((chatMessage) => {
    const { User_Message, username } = chatMessage;
    if (!chatMessage.privateReceiver) {
      console.log(chalk.green(username + ':' + User_Message.split('\n')[0]));
    } else {
      if (username === data.currentUser || data.currentUser === chatMessage.privateReceiver) {
        console.log(chalk.yellow(username + ':' + User_Message.split('\n')[0]));
      }
    }
  })
});

repl.start({
  prompt: '',
  eval: (User_Message) => {

    let regex1 = /(\S+\w+\s+){2}/gm; //grabs /w Jason
    let regex1string = User_Message.match(regex1);

    let messageConstructor = User_Message.split(' ');
    let messageType = messageConstructor[0];
  
    let privateReceiver = null;
    if (messageType === '/to') {
      privateReceiver = regex1string[0].split(' ')[1];
    }

    if(messageType === '/to'){
      socket.emit('private message', { username, User_Message, privateReceiver, messageType })
    } else {
      socket.emit('message', { User_Message, username});
    }
      
  }
})

