$(function() {
var socket = io.connect();
socket.emit('ready');


var App = {};

var canvasLayer = function(location, id, height, width) {
  this.element = document.createElement('canvas');
  this.height = height;
  this.width = width;
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

canvasLayer.prototype.changeColor = function(color) {
  this.context.strokeStyle = color;
}

canvasLayer.prototype.clear = function() {
  this.context.clearRect(0, 0, this.width, this.height);
}

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

App.loadPage = function(url, sendLoad) {
  App.board.clear();
  var imageUrl = 'http://' + window.location.host + '/image?url=' + url;
  var $img = $('<img>', {src: imageUrl});
  $img.load(function() {
    App.board.context.drawImage(this, 0, 0);
    if (sendLoad) {
      App.socket.emit('loadpage', {
        url: url
      });
    }
  });
};

App.init = function() {
  App.socket = io.connect();
  App.socket.on('draw', function(data) {
    App.draw(data.x, data.y, data.type);
  });
  App.socket.on('clear', function() {
    App.board.clear();
  });
  App.socket.on('loadpage', function(data) {
    App.loadPage(data.url, false);
  });
  App.board = new canvasLayer('body', 'board', $(window).height()-130, $(window).width()-10);
  App.board.context.fillStyle = "solid";
  // App.board.context.strokeStyle = "#000";
  App.board.context.lineWidth = 3;
  App.board.context.lineCap = "round";

  $('canvas').on('drag dragstart dragend', function(e) {
    var type = e.handleObj.type;
    var offset = $(this).offset();
    x = e.pageX - offset.left;
    y = e.pageY - offset.top;
    App.board.draw(x, y, type);
    App.socket.emit('draw', {
      x: x,
      y: y,
      type: type
    });
  });

  $('#clearbutton').on('click', function(e) {
    App.board.clear();
    App.socket.emit('clear');
  });

  $("#urlform").submit(function(e) {
    e.preventDefault();
    App.loadPage($("#urlinput").val(), true);
  });
}

App.init();

});