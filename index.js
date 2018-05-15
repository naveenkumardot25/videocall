const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const accountSid = 'ACe1255a05b7875a412b238b984bd9656d';
// const authToken = 'ce024018571ebe9dfeea01b8df1e0785';
// const client = require('twilio')(accountSid, authToken);

// client.tokens.create().then(token => {
//   console.log('token',token.username)
//   console.log('token',token)
// }).done();

const port = process.env.PORT || 5000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {

  socket.on('onicecandidate', (e) => {
    io.emit('onicecandidatejs', e);
  });

  socket.on('localDescription', (e) => {
    io.emit('localDescriptionjs', e);
  });

  socket.on('boblocal', (e) => {
    io.emit('boblocaljs', e);
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});


// iceServers:
//    [ { url: 'stun:global.stun.twilio.com:3478?transport=udp' },
//      { url: 'turn:global.turn.twilio.com:3478?transport=udp',
//        username: '4ef3d06ae51bc58768d7d22a3b3be81542b9d81988fd860c34548f25f16c80ff',
//        credential: 'zYtOsxSR9A2K3TWEHmiULKT5t71JCPvGt5S9zWh/3gY=' },
//      { url: 'turn:global.turn.twilio.com:3478?transport=tcp',
//        username: '4ef3d06ae51bc58768d7d22a3b3be81542b9d81988fd860c34548f25f16c80ff',
//        credential: 'zYtOsxSR9A2K3TWEHmiULKT5t71JCPvGt5S9zWh/3gY=' },
//      { url: 'turn:global.turn.twilio.com:443?transport=tcp',
//        username: '4ef3d06ae51bc58768d7d22a3b3be81542b9d81988fd860c34548f25f16c80ff',
//        credential: 'zYtOsxSR9A2K3TWEHmiULKT5t71JCPvGt5S9zWh/3gY=' } ]