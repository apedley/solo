var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
var pageLoader = require('./pageloader.js');
server.listen(port);

app.use(express.static(__dirname + '/../client'));
app.get('/image', pageLoader.load);



io.on('connection', function (socket) {
  socket.on('draw', function(data) {
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type
    });
  });
});

