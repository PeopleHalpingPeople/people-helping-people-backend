'use strict';

const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
const { argv, emit } = require('process');
const { io } = require('socket.io-client');
let username = null;


socket.on('disconnect', () => {
  socket.emit('disconnect');
})


socket.on('connect', () => {
  console.log(chalk.red('---- Start Chatting ----'))
  username = process.argv[2];
  socket.emit('add user', { username, socketID: socket.id })
});

socket.on('message', (data) => {
  const { User_Message, username } = data;
  console.log(chalk.green(username + ':' + User_Message.split('\n')[0]));
})

socket.on('private message', (data) => {
  const { User_Message, username } = data;
  console.log(username, users[username])
  console.log(chalk.green(username + ':' + User_Message.split('\n')[0]));
});

repl.start({
  prompt: '',
  eval: (User_Message) => {
 // add a conditional for regular message or private message

    let regex1 = /(\S+\w+\s+){2}/gm; //grabs /w Jason
    let regex1string = regex1.test(User_Message);
    let regex2 = /\B\W\S/gm; // grabs just /w
    let messageType = regex2.test(regex1string);
    let regex3 = /[A-Z]+\w+\w/gm // grabs just the name
    let privateUser = regex3.test(regex1string);


    if(messageType === '/w'){
      socket.emit('private message', { User_Message, privateUser, messageType })
    };
    socket.emit('message', { User_Message, username});
  }
})

