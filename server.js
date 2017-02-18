function handler (req, res) {
  fs.readFile(__dirname + '/client.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs')
var Game = require('./game.js')

var game = new Game() 

io.on('connection', function (socket) {

  socket.player = game.createPlayer(socket);
  console.log("a client connected");

  setInterval(function() {
    	var message = game.serialize();
    	message.you = socket.player.serialize();
    	socket.emit('update', message);
	}, 20);

  socket.on('move', function (rot) {
    var player = socket.player;
    this.player.move(rot);
  })

  socket.on('fire', function () {
	socket.player.fire();
  });

});


app.listen(80);