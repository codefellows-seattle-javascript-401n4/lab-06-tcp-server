'use strict';


let id = 0;

const client = module.exports = {};

let getID = (value) => {
  return Object.keys(client.users).find(key => client.users[key] === value);
};

client.users = { length: 0 };

client.setName = (name, socket) => {

  let index = getID(socket);
  client.users[index].username = name;
  return [index];

};

client.addUser = (socket) => {

  id++;
  client.users[id] = socket;
  if(client.users[id].username === undefined) { client.users[id].username = `User${id}`;}
  client.users.length++;
  return id;

};

client.removeUser = (socket) => {

  let id = getID(socket);
  let username = client.users[id].username;
  delete client.users[id];
  client.users.length--;
  return username;

};

client.getPMUser = (sender, recip) => {
  let receiver = undefined;

  for(let key in client.users) {
    if(client.users[key].username === recip) {
      receiver = client.users[key];
      if(sender === receiver) return 'self';
    }
  }
  return receiver;
};

client.getUserList = (socket) => {

  let currUser = getID(socket);
  let users = [];
  for(let key in client.users) {
    if (client.users.hasOwnProperty(key) && key !== 'length' && key !== currUser){
      users.push(client.users[key].username);
    }
  }
  return users;
};
