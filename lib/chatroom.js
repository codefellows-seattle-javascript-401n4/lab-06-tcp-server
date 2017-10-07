'use strict';
const chatroom = module.exports = exports = {};

const net = require("net");
const port = 3005;
const server = net.createServer();

const user = require('./user.js');
const socketPool = {};

server.on('connection', (socket) => {

    // socket.username = `User ${Math.random()}`;
    //
    // socketPool = [...socketPool, socket];

    // let username = (Math.random()+1);

    var date = new Date();
    var epoch = date.getTime();
    // var username = epoch * Math.random();
    let username = Math.floor(epoch * Math.random()+1);

    socketPool[username] = new user(username, socket);

    socket.on('data', (buffer) => {
      let text = buffer.toString();
      // loop through every user
      let newText = text.split(' ');
      console.log(newText);
      if (text.startsWith('@')){
        //detect @dm, @exit, @nickname then do something
        switch (text){
          case '@dm ':
            console.log(text);
            socketPool[newText[1]];
            
            break;
          case '@quit\r\n':
            socketPool[username].closeSocket();
            socketPool[username] = null;
            delete socketPool[username];
            break;
          case '@nickname ':
            //code
            break;
          default:
            socketPool[username].sendMessage(`you entered ${text}. this will not work bro.`);
        }
      } else {
        for (var prop in socketPool) {
          socketPool[prop].sendMessage(buffer);
        }
      }


        // for (var prop in socketPool) {
        //   socketPool[prop].sendMessage(buffer);
        // }

      //   nickname => {
      //   if ( text.startsWith("@nickname"))  {
      //   return text.trim().split(" ").slice(1).join(" ");
      // }}

        // let text = buffer.toString();
        //
        // // /nickname <something>
        // if ( text.startsWith("@nickname"))  {
        //     socket.username = text.trim().split(" ").slice(1).join(" ");
        // }
        //
        // // hit up my /dm
        // if ( text.startsWith("dm")){
        // }
        // // /quit
        // if ( text.startsWith("/quit")) {
        // }
        // Broadcast the message
        // console.log(user.username, ":", text);

        // socketPool.forEach(function(connection) {
        //     connection.write(text);
        // });
    });
});

server.listen(port, ()=>{
    console.log("Port in Court!", port);
});

// let newUser = new User(socket);
//   socketPool[...socketpool, newUser];
//   console.log(socketPool);
