'use strict';

const net = require("net");
const port = 3000;
const server = net.createServer();

let clientPool = [];

function Client (socket){
  this.username = `user ${Math.floor(Math.random()*10000)}`;
  this.socket = socket;
  clientPool.push(this);
}

Client.prototype.help = function(text) {
  if (text.startsWith("/help")) {
    console.log("Welcome! Here are the available commands:")
    console.log("/nickname <nickname> to set your nickname");
    console.log("/w <username> <message> to message a specific user");
    console.log("/roll <number of sides> to roll the dice");
    console.log("/quit to exit the server")
  }
}

Client.prototype.nickname = function(client, text) {
  if ( text.startsWith("/nickname"))  {
    client.username = text.trim().split(" ").slice(1).join(" ");
  }
}

Client.prototype.welcome = function(client) {

  //writes to each client so everyone sees one anothers' messages.
  clientPool.forEach(user => {
    user.socket.write(client.username + ' has entered.')
  })

  //console log so host sees traffic.
  console.log(client.username + ' has entered.');
}

//works but throws an error.
Client.prototype.quit = function(client, text){
  if ( text.startsWith("/quit")) {
    client.socket.destroy();
  }
}

Client.prototype.message = function(client, text) {
  //console log so host can se emessages.
  console.log(client.username, ":", text);

  //writing to each of our clients so they all recieve each user's message.
  clientPool.forEach(user => {
    user.socket.write(client.username + ": " + text);
  });
}

// will allow users to roll dice in chat.
// Client.prototype.roll = function(client, text) {
//   if (text.beginsWith('/roll')){
//     let input = text.trim().split(' ').slice(1);
//     let diceRoll = Math.ceil(Math.random()*sides);
//     clientPool.forEach(user => {
//       user.socket.write(client.username + "");
//     });
//   }
// }

Client.prototype.begin = function(client) {

  client.socket.on("data", (buffer) => {

    let text = buffer.toString();

    client.message(client, text);
    client.nickname(client, text);
    client.help(text);
    client.quit(client, text);

  });
}

server.on('connection', (socket) => {

  let client = new Client(socket);
  let clientIndex = clientPool.indexOf(client);

  client.welcome(client);
  client.begin(client);

  client.socket.on('error', err => console.log(err));
  client.socket.on('disconnect', ()=> console.log(client.username + 'has left.'));

});

server.listen(port, ()=>{
    console.log("Alive on port", port);
});
