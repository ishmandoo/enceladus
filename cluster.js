class Cluster {
  constructor(pos, map) {
    this.pos = pos
    this.map = map
    this.players = []
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
}

function combineClusters(cluster1, cluster2) {
  var map1 = cluster1.map;
  var map2 = cluster2.map;
  var newMap = combineMaps(map1, map2);

  var newPos = {}
  newPos.x = min(cluster1.pos.x, cluster2.pos.x)
  newPos.y = min(cluster1.pos.y, cluster2.pos.y)

  var newCluster = new Cluster(newPos, newMap);
  newCluster.addPlayerList(cluster1.players);
  newCluster.addPlayerList(cluster2.players);
  return newCluster;
}
