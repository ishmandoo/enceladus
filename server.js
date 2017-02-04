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

engine.world.gravity = {scale: 0, x: 0, y:0};

// create two boxes and a ground
var boxA = Bodies.rectangle(0, 100, 80, 80);

//console.log(boxA);


// add all of the bodies to the world
World.add(engine.world, [boxA]);

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
    socket.emit('update', boxA.position);
  },20);

  socket.on('action', function (dir) {
    Matter.Body.applyForce(boxA, {x:0,y:0}, dir)
  })
});

setInterval(function() {
  Engine.update(engine, 20);
},20);

app.listen(80);
