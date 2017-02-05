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


var bodies = [];


//First two example clusters
var clusterA=[
[0,0,0,1,0],
[1,1,0,1,0],
[0,1,1,1,1]
];

var clusterB=[
[0,1,0,1,0],
[1,1,0,1,0],
[0,1,1,1,1],
[1,1,1,1,1],
[1,0,0,0,1]
];

var A = new Object();
A.originx=0;
A.originy=0;
A.width=clusterA.length;
A.height=clusterA[0].length;

var B = new Object();
B.originx=3;
B.originy=-2;
B.width=clusterB.length;
B.height=clusterB[0].length;

//The newly created cluster
var C = new Object();
C.originx=Math.min(A.originx,B.originx);
C.originy=Math.min(A.originy,B.originy);
C.width=Math.max(A.originx+A.width,B.originx+B.width)-C.originx;
C.height=Math.max(A.originy+A.height,B.originy+B.height)-C.originy;

console.log("New origin is at "+C.originx+", "+C.originy);

A.originoffsetx=A.originx-C.originx;
A.originoffsety=A.originy-C.originy;
B.originoffsetx=B.originx-C.originx;
B.originoffsety=B.originy-C.originy;



//Draw'em
var offset1=300;
var boxwidth=50;
for(i=0;i<A.width;i++){
	for(j=0;j<A.height;j++){
		if(clusterA[i][j]){
			bodies.push(Bodies.rectangle(boxwidth*(i+A.originx),offset1+boxwidth*(j+A.originy), boxwidth, boxwidth));
			//console.log("pushed at "+i+", "+j);
		}
	}
}

for(i=0;i<B.width;i++){
	for(j=0;j<B.height;j++){
		if(clusterB[i][j]){
			bodies.push(Bodies.rectangle(offset1+boxwidth*(i+B.originx), offset1+boxwidth*(j+B.originy), boxwidth, boxwidth));
			//console.log("pushed at "+i+", "+j);
		}
	}
}


//Create empty final array filled with 0's
var newArray = [];
for(i=0;i<C.width;i++){
	newArray.push([]);	
	for(j=0;j<C.height;j++){
		newArray[i].push(0);
	}
}

console.log("New array is "+C.width+" by "+C.height);

console.log("Filling new array with cluster A blocks:");
//Add A clusters to final array
//console.log("***********************************************");
for(i=0;i<A.width;i++){
	for(j=0;j<A.height;j++){
		if(clusterA[i][j]){
			newArray[i+A.originoffsetx][j+A.originoffsety]=1;
			//console.log("pushed at "+i+", "+j);
		}
	}
}

//console.log("***********************************************");

console.log("Filling new array with cluster B blocks:");
//Add A clusters to final array
for(i=0;i<B.width;i++){
	for(j=0;j<B.height;j++){
		if(clusterB[i][j]){
			newArray[i+B.originoffsetx][j+B.originoffsety]=1;
			//console.log("pushed at "+i+", "+j);
		}
	}
}

console.log(newArray);
console.log("Adding blocks for combined array:");

//Add final array to bodies array, to be drawn
var newArrayoffset=800;
for(i=0;i<C.width;i++){
	for(j=0;j<C.height;j++){
		if(newArray[i][j]){
			bodies.push(Bodies.rectangle(boxwidth*i, newArrayoffset+boxwidth*j, boxwidth, boxwidth));
			console.log("pushed at "+i+", "+j);
		}
	}
}



// add all of the bodies to the world
World.add(engine.world, bodies);

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

var updateperiod=100;

io.on('connection', function (socket) {
  setInterval(function() {
	socket.emit('update', bodies.map(function(body){return body.position}));
  },updateperiod);

});

setInterval(function() {
  Matter.Engine.update(engine, updateperiod);
},updateperiod);

app.listen(80);
