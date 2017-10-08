'use strict';
const net = require('net');
module.exports = (buffer, socket, pool)=>{
  let text = buffer.toString();
  let tempName = socket.username;
  //  Use /nickname <something> to change my name
  if ( text.startsWith("/nickname"))  {
      socket.username = text.trim().split(" ").slice(1).join(" ");
      console.log(`user ${temp} has changed his name to ${socket.username}`);
      return pool;
  }

//  Direct Message a specific user
  if ( text.startsWith("/dm")){
      let toUser = text.trim().split(/[@\s]/);
      console.log('message to',toUser);
      // get the username
      let findUser = pool.filter(ele=>ele.socket.username===toUser[1]);
      //  console.log('user found: ', findUser);
      let message = text.split(" ").slice(2).join(" ");
       findUser.map(ele=>ele.socket.write(`${socket.username} says: ${message}\n`));
       return pool;
  }
  // list
  if ( text.startsWith("/list")) {
    socket.write(`users online: \n ${pool.map(ele=>ele.socket.username)} \n`);
    return pool;
  }
  // Outta Here!
  if ( text.startsWith("/quit")) {
      // delete your socket from the clientpool
      socket.end();
      console.log(`user ${socket.username} has left chat. `);
      // socketPool.filter(ele=>ele.socket.username!==tempName);
      return pool.filter(ele=>ele.socket.username!==tempName);
  }
}
