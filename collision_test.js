var Matter = require('matter-js/build/matter.js');

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();


// create two boxes and a ground
var boxA = Bodies.rectangle(0, 0, 80, 80);
var boxB = Bodies.rectangle(0, 100, 80, 80, {isStatic: true});


// add all of the bodies to the world
World.add(engine.world, [boxA, boxB]);


setInterval(function() {
  Engine.update(engine, 100);
  console.log(boxA.position)
},20);
