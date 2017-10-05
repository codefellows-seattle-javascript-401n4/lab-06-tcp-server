'use strict';

let expect = require('expect');
let Client = require('../lib/client.js');


describe('Constructor Test', () => {
  it('should exist and pass me an object!', () => {
    let client = new Client('testable');
    expect(JSON.stringify(client)).toEqual(JSON.stringify({socket: 'testable', nickname: client.nickname}));
    console.log(client);
  });
});
