'use strict';

//basic server construction
const net = require('net');
const port = 3000;
const server = net.createServer();

//a place for our clients to soak.
let clientPool = [];

//creates an object for each client to track their username and socket.
function Client (socket){
  this.username = `user ${Math.floor(Math.random()*10000)}`;
  this.socket = socket;
  clientPool.push(this);

}

//displays help text.
Client.prototype.help = function(client, text) {

  if (text.startsWith('/help')) {
    client.socket.write('Welcome! Here are the available commands:/r')
    client.socket.write('/nickname <nickname> to set your nickname/r');
    client.socket.write('/w <username> <message> to message a specific user/r');
    client.socket.write('/quit to exit the server/r');

    // still implementing...
    // client.socket.write('/roll <number of sides> to roll the dice');

  }
}

//lists all users.
Client.prototype.list = function(client, text) {

  if (text.startsWith('/list')){
    client.socket.write('Users currently logged in: ')

    clientPool.forEach(user => {
      client.socket.write(user.username + '/r');

    });
  }
}

//allows users to set a nickname for their session.
Client.prototype.nickname = function(client, text) {
  let oldName = client.username;

  if ( text.startsWith('/nickname')) {
    client.username = text.trim().split(' ').slice(1).join(' ');

    clientPool.forEach(user => {
      user.socket.write(oldName + ' change their name to ' + client.username);

    })
  }
}

//welcomes each user as they enter.
Client.prototype.welcome = function(client) {
  client.socket.write('Welcome! type /help for a list of commands.')
  //writes to each client so everyone sees one anothers' messages.

  clientPool.forEach(user => {
    user.socket.write(client.username + ' has entered.')

  })

  //console log so host sees traffic.
  console.log(client.username + ' has entered.');

}

//allows users to disconnect and displays an exit message.
Client.prototype.quit = function(client, text){

  if ( text.startsWith('/quit')) {

    //lets each user know that the user is logging out.
    clientPool.forEach(user => {
      user.socket.write(client.username + ' has logged out.')

    })

    //now that we've messaged everyone we can destroy the connection.
    client.socket.destroy();
  }
}

Client.prototype.message = function(client, text) {

  //console log so host can see messages and commands.
  console.log(client.username, ':', text);

  //ensures user commands aren't logged publicly. Whisper should be private for
  //example.
  if(text.startsWith('/quit') ||
     text.startsWith('/whisper') ||
     text.startsWith('/list') ||
     text.startsWith('/roll') ||
     text.startsWith('/nickname') ||
     text.startsWith('/help')){
       return;

  }else{

    //writing to each of our clients so they all recieve one another's message.
    clientPool.forEach(user => {
      user.socket.write(client.username + ': ' + text);

    });
  }
}

// will allow users to roll dice in chat.
// Client.prototype.roll = function(client, text) {
//   if (text.initializesWith('/roll')){
//     let input = text.trim().split(' ').slice(1);
//     let diceRoll = Math.ceil(Math.random()*sides);
//     clientPool.forEach(user => {
//       user.socket.write(client.username + '');
//     });
//   }
// }

Client.prototype.whisper = function (client, text) {
  if(text.startsWith('/whisper')){

    let recipientName = text.trim().split(' ').slice(1)[0];
    let message = text.trim().split(' ').slice(2, text.length).join(' ');

    clientPool.forEach(user => {

      if (user.username === recipientName){
        user.socket.write(client.username + ' whispered: ' + message);

      }
    })
  }
}

//all of our prototypes can be called with this function.
Client.prototype.initialize = function(client) {

  client.socket.on('data', (buffer) => {

    let text = buffer.toString();
    client.message(client, text);
    client.whisper(client, text);
    client.list(client, text);
    client.nickname(client, text);
    client.help(client, text);
    client.quit(client, text);

  });
}

//on connnection the server creates a client using the socket.
server.on('connection', (socket) => {

  let client = new Client(socket);

  //welcoming needs to happen before anything else and is not included
  //in the initialize function
  client.welcome(client);
  client.initialize(client);

  //handles errors and disconnects.
  client.socket.on('error', err => console.log(err));
  client.socket.on('disconnect', ()=> console.log(client.username + 'has left.'));

});


server.listen(port, ()=>{
    console.log('Server is up on port ', port);
});
