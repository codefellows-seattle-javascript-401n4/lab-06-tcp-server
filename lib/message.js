'use strict';



const message = module.exports = {};



message.command = function (text) {
  let base = text.split (' ');
  let command = base [0].split (' / ') [1];

  console.log (command);
  console.log (text + 1);
  return command;
};



message.name = function (user, text) {
  user.name = text.trim ().split (' '). slice (1).join (' ');
  console.log ('$ {user.id} has been updated to $ {user.name}');
  user.socket.write ('name changed to $ {user.name} \r\n');
};



message.dm = function (user, text, clientPool) {
  let recipient = txt.trim ().split (' ').slice (1, 2).join (' ');
  let directMessage = text.trim ().split (' ').slice (2).join (' ');
  let target;


  clientPool.forEach (client => {
    if (client.name === recipient) {
      target = client.socket;
      console.log ('dm from $ {user.name} to $ {recipient}');
      target.write (user.name + ' : $ {directMessage} \r\n');
    }
  });

    if (target === undefined) {
      user.write ('user not found. \r\n');
    };



  message.list = function (user, text, clientPool) {
    console.log (text + 2);
    console.log ('$ {user.name} list current users');
    clientPool.forEach (client => {
      user.socket.write ('$ {client.name} \r\n');
    });
  };



  message.quit = function (user, text, clientPool) {
    let index = clientPool.indexOf (user);

    clientPool.splice (index, 1);

    clientPool.forEach (client => {
      client.socket.write (user.name + ' has disconnected \r\n');
    });

    console.log (user.name + ' has disconnected');
    user.socket.end ();
  };



  message.talk = function (user, text, clientPool) {
    console.log (user.name + ' : $ {text}');
    clientPool.forEach (client => {
      client.socket.write (' $ {user.name} : $ {text} \r\n');
    });
  };


};
