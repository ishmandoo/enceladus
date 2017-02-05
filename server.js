var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs')

var Matter = require('matter-js/build/matter.js');

var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var engine = Engine.create();

boxWidth = 18


engine.world.gravity = {scale: 0, x: 0, y:0};

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

  socket.player = createPlayer();
  socket.player.socket = socket;
  console.log("a client connected");

  setInterval(function() {
    bodies = engine.world.bodies
    //console.log(io.sockets.connected)
    socket.emit('update',
    {
      clusters: bodies.map(function (body){
        return {
          boxes: body.clusterArray,
          pos: body.position
        }
      }),
      players: Object.keys(io.sockets.connected).map(function (key){
        var socket = io.sockets.connected[key]
        return getPlayerCoordinates(socket.player);
      })
    })}, 20);

  socket.on('move', function (rot) {
/*
    dirConversion=[
      [0,1],
      [1,0],
      [0,-1],
      [-1,0]
    ]

    dirConversionReverse function(declanDir){
      switch(curDir){

        case [0,1]:
          return 0;
        break;
        case [1,0]:
          return 1;
        break;
        case[0,-1]:
          return 2;
        break;
        case[-1,0]:
          return 3;
        break;
    }
*/
    player = socket.player
    res = findNewPlayerPos(player.cluster, player.pos, player.dir, rot)
    newPos = res.pos
    newDir = res.dir
    player.pos = newPos
    player.dir = newDir

  })

  socket.on('fire', function () {
    dirConversion=[
      {x:0,y:0.01},
      {x:-0.01,y:0},
      {x:0,y:-0.01},
      {x:0.01,y:0}
    ]

    searchList = [
      {x:0, y:1},
      {x:-1, y:1},
      {x:-1, y:0},
      {x:-1, y:-1},
      {x:0, y:-1},
      {x:1, y:-1},
      {x:1, y:0},
      {x:1, y:1},
    ]

    var player = socket.player
    console.log(player.pos);
    console.log(player.cluster.clusterArray);
    var oldDir = player.dir
    player.burn = true
    setTimeout(function() {
      player.burn = false
    }, 200)

    if(player.pos.x >= player.cluster.clusterArray.length || player.pos.x >= player.cluster.clusterArray[0].length){
      player.pos.x = 0
      player.pos.y = 0
      player.dir = 0
    }
    player.cluster.clusterArray[player.pos.x][player.pos.y] -= 1;
    if (player.cluster.clusterArray[player.pos.x][player.pos.y] <= 0) {
      var oldCluster = player.cluster
      var newCluster = createCompositeFromArray(oldCluster.clusterArray, oldCluster.bounds.min, oldCluster.players)
      player.cluster = newCluster
      World.remove(engine.world, [oldCluster]);
      World.add(engine.world, newCluster);

      var testPos = addPos(player.pos, searchList[(2*player.dir)%8])
      if (blockAt(player.cluster, testPos)){
        player.pos = testPos
      } else {
        for (i=1; i<8; i++){
          var searchIndex = (i+2*player.dir)%8;
          var testPos = addPos(player.pos, searchList[searchIndex])
          if (blockAt(player.cluster, testPos)){
            player.pos = testPos
            player.dir = Math.floor(searchIndex/2)
            break;
          }
        }
      }

    }

    Body.applyForce(player.cluster, player.cluster.position, dirConversion[oldDir]);
  });
});

setInterval(function() {
  Engine.update(engine, 20);
},20);

function createPlayer(){

  var player = {pos:{x:0,y:0},dir:0, burn:0};
  newCluster = createCompositeFromArray([[16,16],[16,16]], {x: 100, y:100}, [player]);
  player.cluster = newCluster;
  World.add(engine.world, newCluster); // Array?

  return player
}

function getPlayerCoordinates(player){
  offsets = [
    {x: 0,y:-2 },
    {x: 1 ,y: 0},
    {x: 0,y: 1 },
    {x:-2 ,y: 0}
  ]
  return {
    pos: {
      x: player.cluster.position.x + (boxWidth * (player.pos.x + offsets[player.dir].x)),
      y: player.cluster.position.y + (boxWidth * (player.pos.y + offsets[player.dir].y))
    },
    dir: player.dir,
    burn: player.burn
  }
}


function createCompositeFromArray(arr, pos, players){
    bodies = []
    iMax = arr.length
    jMax = arr[0].length
    for(i = 0; i < iMax; i++){
        for(j=0; j < jMax; j++){
            if (arr[i][j] > 0) {
                bodies.push(Bodies.rectangle((i+0.5) * boxWidth + pos.x, (j+0.5) * boxWidth + pos.y, boxWidth, boxWidth))
            }
        }
    }
    var compound = Body.create({
        parts: bodies,
    });
    compound.clusterArray = arr;
    compound.players = players;
    return compound;
}

function killPlayer(player){
  console.log("player killed")
  var socket = player.socket;
  player = createPlayer();
  socket.player = player;

  return player

}

function combineComposites(clusterA, Aorigin, clusterB, Borigin) {
    /*
    Aorigin and B origin are "absolute" indices. If you want them to be relative to each
    other, then make Aorigin = [0,0] and Borigin with respect to that.
    Corigin is "absolute" as well.
    */
    var A = new Object();
    A.originx=Aorigin[0];
    A.originy=Aorigin[1];
    A.clusterArray = clusterA.clusterArray
    A.width=clusterA.clusterArray.length;
    A.height=clusterA.clusterArray[0].length;
    var B = new Object();
    B.originx=Borigin[0];
    B.originy=Borigin[1];
    B.clusterArray = clusterB.clusterArray
    B.width=clusterB.clusterArray.length;
    B.height=clusterB.clusterArray[0].length;
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
    //Create empty final array filled with 0's
    var newClusterArray = [];
    for(i=0;i<C.width;i++){
        newClusterArray.push([]);
        for(j=0;j<C.height;j++){
            newClusterArray[i].push(0);
        }
    }
    console.log("New array is "+C.width+" by "+C.height);
    console.log("Filling new array with cluster A blocks:");
    //Add A clusters to final array
    //console.log("***********************************************");
    for(i=0;i<A.width;i++){
        for(j=0;j<A.height;j++){
            if(A.clusterArray[i][j]){
                newClusterArray[i+A.originoffsetx][j+A.originoffsety]=A.clusterArray[i][j];
            }
        }
    }

    console.log("Filling new array with cluster B blocks:");
    //Add B clusters to final array
    for(i=0;i<B.width;i++){
        for(j=0;j<B.height;j++){
            if(B.clusterArray[i][j]){
                newClusterArray[i+B.originoffsetx][j+B.originoffsety]=B.clusterArray[i][j];
            }
        }
    }
    //newClusterArray.map(function(yrow){yrow.reverse()})
    return newClusterArray;
}

function getRandomClusters(xBds,yBds,numRand){

	/*
	xBds is a pair of the form {lower bound, upper bound} in pixels,
	for where you want the randomly generated clusters to be placed.
	Same with yBds. numRand is the number of clusters you want.
	randList is returned, in the form of a list of pairs [[x1,y1],[x2,y2],...].
	*/

	var xLB=xBds[0];
	var xUB=xBds[1];
	var xRange=xUB-xLB;
	var yLB=yBds[0];
	var yUB=yBds[1];
	var yRange=yUB-yLB;
	var randList=[];
	for(i=0;i<numRand;i++){

		var xpos=xLB+Math.floor(Math.random()*xRange);
		var ypos=yLB+Math.floor(Math.random()*yRange);
		console.log(xpos+", "+ypos);
		randList.push([xpos,ypos]);

	}
	return(randList);
}

function findNewPlayerPos(cluster, pos, dir, rot){
  dirChanges = [-1, 0, 1]

  cw = [
    [{x:1,y:-1}, {x:1,y:0}, {x:0,y:0}],
    [{x:1,y:1}, {x:0,y:1}, {x:0,y:0}],
    [{x:-1,y:1}, {x:-1,y:0}, {x:0,y:0}],
    [{x:-1,y:-1}, {x:0,y:-1}, {x:0,y:0}],
  ]

  ccw = [
    [{x:-1,y:-1}, {x:-1,y:0}, {x:0,y:0}],
    [{x:1,y:-1}, {x:0,y:-1}, {x:0,y:0}],
    [{x:1,y:1}, {x:1,y:0}, {x:0,y:0}],
    [{x:-1,y:1}, {x:0,y:1}, {x:0,y:0}],
  ]

  if (rot == 1){
    table = cw
  } else {
    table = ccw
  }

  for(i = 0; i<=2; i++){
    if (blockAt(cluster, addPos(table[dir][i], pos))) {
      newPos = addPos(table[dir][i], pos);
      newDir = (4 + dir + dirChanges[i] * rot ) % 4;
      return {dir: newDir, pos: newPos};
    }
  }
  return {dir: dir, pos: pos};


}

function blockAt(cluster, loc){
  console.log(loc)
  if ((loc.x < 0) || (loc.y < 0) || (loc.x >= cluster.clusterArray.length) || (loc.y >= cluster.clusterArray[0].length)) {
    return false;
  }
  if (cluster.clusterArray[loc.x][loc.y] == 0){
    return false;
  } else {
    return true;
  }
}

function addPos(pos1, pos2){
  return {x:pos1.x+pos2.x,y:pos1.y+pos2.y}
}

var events;
function collisionCallback(event){
    pair = event.source.broadphase.pairsList[0]
    obj1 = pair[0];
    obj2 = pair[1];
    M = obj1.mass + obj2.mass;
    invM = 1/M;
    jointvelocity = {x: (obj1.velocity.x * obj1.mass + obj2.velocity.x * obj2.mass)/ M,
       y: (obj1.velocity.y * obj1.mass + obj2.velocity.y * obj2.mass)/ M};
    i = Math.round((obj1.bounds.min.x - obj2.bounds.min.x)/ boxWidth)
    j = Math.round((obj1.bounds.min.y - obj2.bounds.min.y)/ boxWidth)
    newX = Math.min(obj1.bounds.min.x,obj2.bounds.min.x)
    newY = Math.min(obj1.bounds.min.y,obj2.bounds.min.y)
    console.log(i)
    console.log(j)
    newClusterArray = combineComposites(obj1, [i,j], obj2, [0,0])

    newCluster = createCompositeFromArray(newClusterArray, {x: newX, y:newY}, [])
    dirConversion=[
      {x:0,y:-1},
      {x:1,y:0},
      {x:0,y:1},
      {x:-1,y:0}
    ]
    newPlayerArray = []
    obj2.players.forEach(function(player){
      if(i < 0){ player.pos.x = player.pos.x - i;}
      if(j < 0){ player.pos.y = player.pos.y - j;}
      if(blockAt(newCluster, addPos(dirConversion[player.dir], player.pos))){
        player = killPlayer(player);

      }else{
      newPlayerArray.push(player)
      player.cluster = newCluster;
    }


    });

    obj1.players.forEach(function(player){
      if(i > 0){ player.pos.x = player.pos.x + i;}
      if(j > 0){ player.pos.y = player.pos.y + j;}
      
      if(blockAt(newCluster, addPos(dirConversion[player.dir], player.pos))){
        player = killPlayer(player);
      }else{
      player.cluster = newCluster;
      newPlayerArray.push(player);
    }
    });
    newCluster.players = newPlayerArray;
    Body.setAngle(newCluster, 0);
    Body.setVelocity(newCluster, jointvelocity);
    World.remove(engine.world, [obj1,obj2]);
    World.add(engine.world, newCluster);
}

Events.on(engine, "collisionStart", collisionCallback);

//objA = createCompositeFromArray([[1,1,0],[1,0,1]], {x: 120, y:100}, [{pos:{x:0,y:0},dir:0, burn:0}])
objB = createCompositeFromArray([[16,0],[0,8],[0,8]], {x: 400, y:100}, [])


Body.setVelocity(objB, {
    x: -5,
    y: 0
});


World.add(engine.world, [objB]);

app.listen(80);
