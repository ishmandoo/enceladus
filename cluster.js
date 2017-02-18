var Matter = require('matter-js/build/matter.js');
var Body = Matter.Body,
    Bodies = Matter.Bodies;

class Cluster {
  constructor(pos, map, game) {
    this.pos = pos;
    this.map = map;
    this.players = [];
    this.body = this.createBody(pos,map);
    this.body.cluster = this;
    this.game = game;
    
  }

  static combineClusters(cluster1, cluster2) {
    var map1 = cluster1.map;
    var map2 = cluster2.map;
    var newMap = combineMaps(map1, map2);

    var newPos = {}
    newPos.x = min(cluster1.pos.x, cluster2.pos.x)
    newPos.y = min(cluster1.pos.y, cluster2.pos.y)

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

