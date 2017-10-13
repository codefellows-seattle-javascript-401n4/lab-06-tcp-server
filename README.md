# Lab 6 README 

## User.js
In User.js, we export a constructor function User, which will store each user's socket, nickname, id, and functions that interact with said user.

sendMessage() sends a message to that particular user, through their socket.
setNickname() sets the nickname, which is initially set to the same value as id.
clostSocket() ends the connecituon if the user quits.

## Server.js

We listen for a connection, and assign a unique id to each socket. That unique id is (at the moment) the epoch value at time of connection. We then create their own unique user variable, which we define in User.js, and store it in socketPool.

Listening for certain @ commands will perform certain functions for the user. If no commands are detected, we simple end a message received to all users.

## Chatroom.js

Starts the chatroom server by importing server.js