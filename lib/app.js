'use strict';

const net = require("net");
const port = 3000;
const server = net.createServer();

let clientPool = [];

function Client (socket){
  this.username = `user ${Math.floor(Math.random()*10000)}`;
  socketPool.push(this);

}

// "on" is the equivalent of addEventListener on the server side.
// The callback -- we get a socket.  What's a socket?  An individual connection
// IP: Building, Port: Apartment Number, Socket: Cubicle
server.on('connection', (socket) => {

  let client = new Socket(socket);

  console.log(socket.username + 'has entered.');

  console.log(socket.username + 'type /help for help');

  clientPool = [...clientPool, socket];

    socket.on("data", (buffer) => {

        let text = buffer.toString();

        if (text.startsWith("/help")) {
          console.log("Welcome! Here are the available commands:")
          console.log("/nickname <nickname> to set your nickname");
          console.log("/w <username> <message> to message a specific user");
          console.log("/roll <number of sides> to roll the dice");
          console.log("/quit to exit the server")
        }

        //  Use /nickname <something> to change my name#
        if ( text.startsWith("/nickname"))  {
            socket.username = text.trim().split(" ").slice(1).join(" ");
        }

        // Direct Message a specific user
        if ( text.startsWith("/w")){
          let targetUser = text.trim().split(" ").slice(1).join(" ");
          console.log(targetUser);

          let targetUserIndex = socketPool.indexOf(targetUser);
          console.log(targetUserIndex);
            if (targetUserIndex > 0) {
              console.log(targetUser + ' is not logged in.');
            }

          let whisper = text.trim().split(" ").slice(2).join(" ");

          console.log(whisper)

          console.log(socketPool[indexOf], ":", text);

          // socketPool[indexOf(targetUser)](function(connection) {
          //     connection.write(text);
          //   });


        }

        // Outta Here!
        if ( text.startsWith("/quit")) {
            // delete your socket from the clientpool
            socket.destroy();
        }

        // Broadcast the message
        console.log(socket.username, ":", text);

        socketPool.forEach(function(connection) {
            connection.write(text);
          });

    });

    socket.on('error' err => console.log(err));
    socket.on('disconnect' ()=> console.log(socket.username + 'has left.'));


});

server.listen(port, ()=>{
    console.log("Alive on port", port);
});
