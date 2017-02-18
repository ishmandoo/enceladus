var Cluster = require("cluster")

class Player {
	constructor(worldPos, socket) {
		this.socket = socket;
		this.worldPos = worldPos;
		this.init();
	}

	burn() {
		this.cluster.applyForce(this.dir);
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
	  for(var i = 0; i<=2; i++){
			var testPos = addPos(table[this.dir][i], this.clusterPos);
	    if (this.cluster.blockAt(testPos)) {
	      this.clusterPos = testPos;
				this.dir = (4 + this.dir + dirChanges[i] * rot ) % 4;
				break;
	    }
	  }
	}

	init () {
		this.clusterPos = {x: 0, y: 0};
		this.cluster = new Cluster([16, 16],[16, 16]], this.worldPos);
		this.cluster.addPlayer(this);
		this.dir = 0;
		this.burn = false;
	}

	kill() {
		this.cluster.removePlayer(this);
		this.init();
	}

	changeCluster(newCluster) {
		this.cluster = newCluster;
	}

	serialize() {
		return {
			clusterPos: this.clusterPos,
			pos: this.cluster.pos, //yes, really
			dir: this.dir
			burn: this.burn
		}
	}
}
