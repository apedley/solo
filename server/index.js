var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;

server.listen(port);

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
  socket.on('draw', function(data) {
    console.log('draw!! ' + JSON.stringify(data));
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type
    });
  });
  // socket.emit('news', { hello: 'world' });
  // socket.on('test', function(data) {
  //   console.log('test');
  // })
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
});


