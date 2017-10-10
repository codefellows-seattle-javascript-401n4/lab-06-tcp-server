
## TCP Chat Room
This tcp chat room is intended to be used in the linux command line.

## How to host:
* type ifconfig and locate your ip address. write it down.
* run node app the lib folder.

as host you can:
* See all traffic on the server, including private messages and commands.
* press ctrl + c to close the server.

## How to join:

* Get the ip address from the host.
* open the command line in linux.
* type telnet host ip address 3000
* press enter.

as a client you can:
* type a message then press enter to chat.
* type /help to get a list of commands.
* type /nickname nickname to change your name.
* type /list to get a list of users.
* type /whisper username message to send a private message to a user.
* type /quit to leave the server.
