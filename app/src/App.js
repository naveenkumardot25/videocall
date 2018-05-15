import React, { Component } from 'react';
import openSocket from 'socket.io-client';
const io = openSocket('http://localhost:5000');

var constraints = window.constraints = {
      audio: true,
      video: true
};
const Iceservers = {
  iceServers:
    [{ url: 'stun:global.stun.twilio.com:3478?transport=udp' },
    {
      url: 'turn:global.turn.twilio.com:3478?transport=udp',
      username: '4ef3d06ae51bc58768d7d22a3b3be81542b9d81988fd860c34548f25f16c80ff',
      credential: 'zYtOsxSR9A2K3TWEHmiULKT5t71JCPvGt5S9zWh/3gY='
    },
    {
      url: 'turn:global.turn.twilio.com:3478?transport=tcp',
      username: '4ef3d06ae51bc58768d7d22a3b3be81542b9d81988fd860c34548f25f16c80ff',
      credential: 'zYtOsxSR9A2K3TWEHmiULKT5t71JCPvGt5S9zWh/3gY='
    },
    {
      url: 'turn:global.turn.twilio.com:443?transport=tcp',
      username: '4ef3d06ae51bc58768d7d22a3b3be81542b9d81988fd860c34548f25f16c80ff',
      credential: 'zYtOsxSR9A2K3TWEHmiULKT5t71JCPvGt5S9zWh/3gY='
    }]
}

const pc = new RTCPeerConnection(Iceservers);
// const bob = new RTCPeerConnection();

pc.onicecandidate = e => {
  if (e.candidate) {
    io.emit("onicecandidate", (e.candidate));
    // bob.addIceCandidate(e.candidate);
  }
}
// io.on("onicecandidate", (e) => pc.addIceCandidate(new RTCIceCandidate(e)));
io.on("onicecandidatejs", (e) => pc.addIceCandidate(e));

io.on("localDescriptionjs", (e) => {
    pc.setRemoteDescription(e)
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(new RTCSessionDescription(answer)))
        .then(() => {
          io.emit("boblocal", pc.localDescription)
          // alice.setRemoteDescription(bob.localDescription)
        });
});

io.on("boblocaljs", (e) => pc.setRemoteDescription(e));

class App extends Component {
    peer = () => {
        return (
          <div>
            <video ref={(ref => {this.myVideo = ref})} autoPlay/>
             <video ref={(ref => {this.myRemote = ref})} autoPlay/>
          </div>
        )
    }
    start = () => {
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            window.stream = stream; // make stream available to browser console
            this.myVideo.srcObject = stream;
            pc.addStream(stream)
           }).catch((error) => console.log(error));
    }
    call = () => {
        pc.createOffer()
        .then(offer => pc.setLocalDescription(new RTCSessionDescription(offer)))
        .then(() => io.emit("localDescription", pc.localDescription))
        // .then(() => bob.setRemoteDescription(alice.localDescription))
        // .then(() => bob.createAnswer())
        // .then(answer => bob.setLocalDescription(new RTCSessionDescription(answer)))
        // .then(() => alice.setRemoteDescription(bob.localDescription));
        pc.onaddstream = (event => this.myRemote.srcObject = event.stream);

      // bob.ontrack = e => {
      //   this.myRemote.srcObject = e.streams[0];
      // }
    }
    Hangup = () => {
        pc.close();
        let stream = this.myVideo.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(function(track) {
          track.stop();
        });
        this.myVideo.srcObject = null;
        this.myRemote.srcObject = null;
    }
    render() {
        // const {videoURL} = this.state;
        return (
            <div className="App">
             <h1>Hello World!</h1>
             <button id="startButton" onClick={this.start}>Start</button>
             <button id="callButton" onClick={this.call}>Call</button>
             <button id="hangupButton" onClick={this.Hangup}>Hang Up</button>
             {this.peer()}
            </div>
        );
    }
}

export default App;









// var config = {
//   apiKey: "AIzaSyBajPcoloVgJTcE44NhPLvVsqnWG9RSBEE",
//   authDomain: "simple-webrtc-video-chat.firebaseapp.com",
//   databaseURL: "https://simple-webrtc-video-chat.firebaseio.com",
//   projectId: "simple-webrtc-video-chat",
//   storageBucket: "simple-webrtc-video-chat.appspot.com",
//   messagingSenderId: "748074977719"
// };
// firebase.initializeApp(config);

// var database = firebase.database().ref();
// var yourVideo = document.getElementById("yourVideo");
// var friendsVideo = document.getElementById("friendsVideo");
// var yourId = Math.floor(Math.random()*1000000000);
// //Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
// var servers = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:numb.viagenie.ca', 'credential': 'beaver', 'username': 'webrtc.websitebeaver@gmail.com' }] };
// var pc = new RTCPeerConnection(servers);
// pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
// pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

// function sendMessage(senderId, data) {
//     var msg = database.push({ sender: senderId, message: data });
//     msg.remove();
// }

// function readMessage(data) {
//     var msg = JSON.parse(data.val().message);
//     var sender = data.val().sender;
//     if (sender != yourId) {
//         if (msg.ice != undefined)
//             pc.addIceCandidate(new RTCIceCandidate(msg.ice));
//         else if (msg.sdp.type == "offer")
//             pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
//               .then(() => pc.createAnswer())
//               .then(answer => pc.setLocalDescription(answer))
//               .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
//         else if (msg.sdp.type == "answer")
//             pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
//     }
// };

// database.on('child_added', readMessage);

// function showMyFace() {
//   navigator.mediaDevices.getUserMedia({audio:true, video:true})
//     .then(stream => yourVideo.srcObject = stream)
//     .then(stream => pc.addStream(stream));
// }

// function showFriendsFace() {
//   pc.createOffer()
//     .then(offer => pc.setLocalDescription(offer) )
//     .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
// }