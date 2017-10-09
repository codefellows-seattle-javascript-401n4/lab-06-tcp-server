'use strict';

const server = require('./lib/server.js');

const port = 3000;

server.listen(port, ()=>{
    console.log(`Chatroom is live on Port ${port}`);
});