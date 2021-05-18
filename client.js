'use strict';

// TODO: Install dependencies, npm init -y, npm i socket node repl chalk
// const PORT = process.env.PORT || 3000;
const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
let username = null;


socket.on('disconnect', () => { // restructure to an arrow function
  socket.emit('disconnect');
})

socket.on('connect', () => {
  console.log(chalk.red('---- Start Chatting ----'))
  username = process.argv[2];
});

socket.on('message', (data) => {
  // const { cmd, username } = data;
  const { User_Message, username } = data;
  console.log(chalk.green(username + ':' + User_Message.split('\n')[0]));
})

repl.start({
  prompt: '',
  eval: (User_Message) => {
    socket.send({ User_Message, username});
  }
})

