var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs')

var Matter = require('matter-js/build/matter.js');

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();


// create two boxes and a ground
var boxA = Bodies.rectangle(0, 100, 80, 80);
var boxB = Bodies.rectangle(100, 100, 80, 80);

var bodies = [boxA, boxB]


// add all of the bodies to the world
World.add(engine.world, [boxA, boxB]);

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


io.on('connection', function (socket) {
  setInterval(function() {
    socket.emit('update', { bodies: bodies });
  },1000);

});

setInterval(function() {
  Matter.Engine.update(engine, 1000);
},1000);

app.listen(80);
