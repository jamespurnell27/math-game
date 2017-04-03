var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;



app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  console.log('a user connected');


  socket.on('disconnect', function(){
    console.log('user disconnected nope');
  });
  socket.on('Chat Msg', function (msg){
    io.emit('Chat Msg', msg);
  });
});

server.listen(port, function(){
  console.log('listening on *:3000');
});
