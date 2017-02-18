var Matter = require('matter-js/build/matter.js');
var Body = Matter.Body,
    Bodies = Matter.Bodies;

class Cluster {
  constructor(pos, map, game) {
    this.map = map;
    this.players = [];
    this.body = this.createBody(pos,map);
    this.body.cluster = this;
    this.game = game;
    
  }

  static combineClusters(cluster1, cluster2) {
    function combineMaps(map1, map2, dx, dy) {
        var height1 = map1.length
        var width1 = map1[0].length
        var height2 = map2.length
        var width2 = map2[0].length

        var dx1 = Math.max(0, -dx)
        var dy1 = Math.max(0, -dy)
        var dx2 = Math.max(0, dx)
        var dy2 = Math.max(0, dy)

        var newWidth = Math.max(width1 + dx1, width2 + dx2)
        var newHeight = Math.max(height1 + dy1, height2 + dy2)
        var newMap = []

        for(y =0; y < newHeight; y++){
          newMap.push([]);
          for(x = 0; x < newWidth; x++){
            var val1 = 0;
            var val2 = 0;
            if ((x - dx1) >= 0 && (x - dx1) < width1 && (y - dy1) >= 0 && (y - dy1) < height1) {
              val1 = map1[y - dy1][x - dx1];
            }
            if ((x - dx2) >= 0 && (x - dx2) < width2 && (y - dy2) >= 0 && (y - dy2) < height2) {
              val2 = map2[y - dy2][x - dx2];
            }
            newMap[y].push(Math.max(val1, val2));
          }
        }

        return newMap;
    }
    
    var boxWidth = 18;
    var map1 = cluster1.map;
    var map2 = cluster2.map;
    var dx = Math.round((cluster2.body.bounds.min.x - cluster1.body.bounds.min.x)/ boxWidth)
    var dy = Math.round((cluster2.body.bounds.min.y - cluster1.body.bounds.min.y)/ boxWidth)
    var newMap = combineMaps(map1, map2, dx, dy);

    var newPos = {}
    newPos.x = min(cluster1.body.bounds.min.x, cluster2.body.bounds.min.x)
    newPos.y = min(cluster1.body.bounds.min.y, cluster2.body.bounds.min.y)

    var newCluster = new Cluster(newPos, newMap, cluster1.game);
    newCluster.addPlayerList(cluster1.players);
    newCluster.addPlayerList(cluster2.players);

    cluster1.destroy();
    cluster2.destroy();

    return newCluster;
  }





  blockAt(loc){
    if ((loc.x < 0) || (loc.y < 0) || (loc.x >= this.map.length) || (loc.y >= this.map.length)) {
      return false;
    }
    if (this.map[loc.x][loc.y] == 0){
      return false;
    } else {
      return true;
    }
  }

  getPosition(){
    return this.body.position
  }

  destroy(){
    game.removeBody(this.body);
  }

  addPlayer(player) {
    this.players.push(player);
    player.changeCluster(this);
  }

  removePlayer(player) {
    var index = this.players.indexOf(player);
    this.players.splice(index, 1);
  }

  addPlayerList(playerList) {
    playerList.forEach(function(player){
      this.addPlayer(player);
    })
  }

  applyForce(forceVect){
    Body.applyForce(this.body, this.body.position, forceVect);
  }

  createBody(pos, map){
    var bodies = [];
    var boxWidth = 18;
    var iMax = map.length;
    var jMax = map[0].length;
    for(var i = 0; i < iMax; i++){
        for(var j=0; j < jMax; j++){
            if (map[i][j] > 0) {
                bodies.push(Bodies.rectangle((i+0.5) * boxWidth + pos.x, (j+0.5) * boxWidth + pos.y, boxWidth, boxWidth));
            }
        }
    }
    var compound = Body.create({
        parts: bodies,
    });

    return compound
  }

  serialize(){
    return {
      map: this.map,
      pos: this.getPosition()
    }
  }

}

module.exports = Cluster;

