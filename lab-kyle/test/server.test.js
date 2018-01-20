/*global afterAll*/
'use strict';

require('jest');
const net = require('net');
const server = require('../server');
const expect = require('expect');

describe('server', function(){
  afterAll((done) => {
    server.close();
    done();
  });

  describe('join chatroom', function(){
    it('should let everyone know someone has joined', function(done){
      let client = net.connect({port: 3000}, () => {
        client.on('data', (data) => {
          expect(data.toString()).toMatch(/is now present/);
        });
        client.end();
        done();
      });
    });

    it('should write "hello" to client2 from client 1', function(done){
      let client1 = net.connect({port: 3000}, () => {
        client1.on('data', (data) => {
          console.log(data.toString());
        });
      });

      let client2 = net.connect({port: 3000}, () => {
        client2.write('@all Hello', () => {
          client1.end();
          client2.end();
          done();
        });
      });
    });
  });
});
