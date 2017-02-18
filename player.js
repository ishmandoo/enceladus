
class Player {
	constructor(worldPos, socket, game) {
		this.socket = socket;
		this.game = game;
		this.burn = false;
		this.spawn(worldPos);
	}

	destroy(){

	}

	fire() {
		var dirConversion = [
	      {x:0,y:0.01},
	      {x:-0.01,y:0},
	      {x:0,y:-0.01},
	      {x:0.01,y:0}
	    ];
		this.cluster.applyForce(dirConversion[this.dir]);
		this.burn = true;
		var player = this;

		setTimeout(function() {
      		player.burn = false;
    	}, 200)

    	//TODO: Code to check if block is depleted of fuel and move player accordingly.
	}

	move(rot) {

		// this is a table of relative cluster positions to check for a player moving clockwise
		// the first index is the direction the player is pointing [N, E, S, W]
		// the second index is the order of blocks to check
		// diagonal block, side block, same block
	  var cw = [
	    [{x:1,y:-1}, {x:1,y:0}, {x:0,y:0}],
	    [{x:1,y:1}, {x:0,y:1}, {x:0,y:0}],
	    [{x:-1,y:1}, {x:-1,y:0}, {x:0,y:0}],
	    [{x:-1,y:-1}, {x:0,y:-1}, {x:0,y:0}],
	  ]

		// same table for counter clockwise moves
	  var ccw = [
	    [{x:-1,y:-1}, {x:-1,y:0}, {x:0,y:0}],
	    [{x:1,y:-1}, {x:0,y:-1}, {x:0,y:0}],
	    [{x:1,y:1}, {x:1,y:0}, {x:0,y:0}],
	    [{x:-1,y:1}, {x:0,y:1}, {x:0,y:0}],
	  ]

		// this list corresponds to the cw and ccw tables
		// it gives the change in direction corresponding to the second index
		var dirChanges = [-1, 0, 1]

		// if rot is 1, we're doing a clockwise rotation, use the cw table
	  var table = []
	  if (rot == 1){
	    table = cw
	  } else {
	    table = ccw
	  }


		// given the player's direction loop over blocks to check
		// when you find a block, move to that block and set the new direction

	function addPos(pos1, pos2){
  		return {x:pos1.x+pos2.x,y:pos1.y+pos2.y}
	}

	  for(var i = 0; i<=2; i++){
			var testPos = addPos(table[this.dir][i], this.clusterIndex);
	    if (this.cluster.blockAt(testPos)) {
	      this.clusterIndex = testPos;
				this.dir = (4 + this.dir + dirChanges[i] * rot ) % 4;
				break;
	    }
	  }
	}

	spawn(pos) {
		this.clusterIndex = {x: 0, y: 0};
		this.cluster = this.game.createCluster(pos, [[16, 16],[16, 16]])
		//this.cluster = new Cluster(this.worldPos, [16, 16],[16, 16]]);
		this.cluster.addPlayer(this);
		this.dir = 0;
		this.burn = false;
	}

	kill() {
		this.cluster.removePlayer(this);
		var scale = 500;
		var worldPos = {x: Math.random()*scale, y: Math.random()*scale}
		this.spawn(worldPos);
	}

	changeCluster(newCluster) {
		this.cluster = newCluster;
	}

	serialize() {
		return {
			clusterIndex: this.clusterIndex,
			pos: this.cluster.getPosition(), 
			dir: this.dir,
			burn: this.burn
		}
	}
}

module.exports = Player;
