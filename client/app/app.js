$(function() {
var socket = io.connect();
socket.emit('ready');


var App = {};

var canvasLayer = function(location, id, height, width) {
  this.element = document.createElement('canvas');
  this.element.setAttribute('width', width);
  this.element.setAttribute('height', height);
  $(this.element)
    .attr('id', id)
    .text('unsupported browser')
    .width(this.width)
    .height(this.height)
    .appendTo(location);

  this.context = this.element.getContext('2d');
};

canvasLayer.prototype.draw = function(x, y, type) {

  if (type === 'dragstart') {
    this.context.beginPath();
    return this.context.moveTo(x, y);
  } else if (type === 'drag') {
    this.context.lineTo(x, y);
    return this.context.stroke();
  } else {
    return this.context.closePath();
  }
};

canvasLayer.prototype.addText = function(text) {
  this.context.font = "10px Arial";
  this.context.strokeText(text,10,50);
}
App.init = function() {
  App.socket = io.connect('http://10.0.0.141:8000');
  App.socket.on('draw', function(data) {
    App.draw(data.x, data.y, data.type);
  });
  App.board = new canvasLayer('body', 'board', 600, 800);
  // App.board.context.fillStyle = "solid";
  // App.board.context.strokeStyle = "#000";
  // App.board.context.lineWidth = 3;
  // App.board.context.lineCap = "round";
  App.draw = function(x, y, type) {
    if (type === 'dragstart') {
      App.board.context.beginPath();
      App.board.context.moveTo(x, y);
    } else if (type === 'drag') {
      App.board.context.lineTo(x, y);
      App.board.context.stroke();
    } else {
      App.board.context.closePath();
    }
  };
  $('canvas').on('drag dragstart dragend', function(e) {
    var type = e.handleObj.type;
    var offset = $(this).offset();
    e.offsetX = e.pageX - offset.left;
    e.offsetY = e.pageY - offset.top;
    x = e.pageX - offset.left;
    y = e.pageY - offset.top;
    App.board.draw(x, y, type);
    App.socket.emit('draw', {
      x: x,
      y: y,
      type: type
    });
  });
}

App.init();

});