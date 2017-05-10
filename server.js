//Bring in modules express and http
var express = require('express');
var http = require('http');
//Create and express app
var app = express();
//Create http server and insert express app as a callback to handle requests
var server = http.createServer(app);
//Bring in socket io modeule. Listen to server events
var io = require('socket.io').listen(server);
//indentify port
var port = process.env.PORT || 3000;

//Other modules
var path = require('path');
//var logger = require('morgan');

// Setup routes
//var router = require('./routes/index');


var users = {};

//Direct to static files
app.use(express.static(__dirname + '/public'));

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//
app.get('/', function(req, res, next){
  res.render('layout');
});

//io listens for server connections
io.sockets.on('connection', function(socket){

  //io listens for when sockets disconnect from server
  socket.on('disconnect', function(){
    deleteByVal(socket.id)
    renderUsers();
  });

  //io listen for when new users have joined
  socket.on('new user', function(user){
    users[user] = {
      id: socket.id,
      chatting: false
    }
    renderUsers();
  });

  //io listen for when a new conversation starts/changes
  socket.on('new conversation', function(data){
    //LET THEM KNOW I WANT TO CHAT
    socket.to(<socketid>).emit('hey', 'I just met you');
  })

  //io listens for when a socket emits a new Chat Msg
  socket.on('send message', function (data){
    //console.log(data);
    io.emit('new message', data);
    //CHANGE TO FOR PRIVATE CHAT
    io.in('game').emit('big-announcement', 'the game will start soon');
  });
});


//Iterate through users object and delete property by value
function deleteByVal(val) {
    for (var key in users) {
        if (users[key].id == val) delete users[key];
    }
}

//Tell sockets when users have joined or lefts
function renderUsers(){
  io.emit('user list', users);
}

//Server listening to port
server.listen(port, function(){
  console.log('listening on *:3000');
});
