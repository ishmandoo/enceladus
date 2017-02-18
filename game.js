var Matter = require('matter-js/build/matter.js');
var Player = require('./player.js');
var Cluster = require('./cluster.js');

var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

class Game {
	constructor(){
		this.engine = Engine.create();
		var engine = this.engine;
		this.world = this.engine.world;
		this.world.gravity = {scale: 0, x: 0, y: 0};
		this.clusterList = [];
		this.playerList = [];

  		setInterval(function() {
			Engine.update(engine, 20);
		},20);


	}

	removeFromArray(array, item){
		var index = array.indexOf(item);
		if (index > -1) {
    		array.splice(index, 1);
		}
	}

	createCluster(pos, map){
		var cluster = new Cluster(pos, map, this);
		this.clusterList.push(cluster);
		World.add(this.world, cluster.body);
		return cluster;
	}

	destroyCluster(cluster){
		this.removeFromArray(this.clusterList, cluster)
		cluster.destroy();
	}

	createPlayer(socket){
		var scale = 500;
		var worldPos = {x: Math.random()*scale, y: Math.random()*scale}; // There should be some logic here.
		var player = new Player(worldPos, socket, this);
		this.playerList.push(player);
		return player;
	}

	destroyPlayer(player){
		player.destroy()
		this.removeFromArray(this.playerList, player)
	}

	removeBody(body){
		World.remove(this.world, body);
	}

	serialize(){
		var playerData = this.playerList.map(function(player){return player.serialize()});
		var clusterData = this.clusterList.map(function(cluster){return cluster.serialize()});
		return {
			players: playerData,
			clusters: clusterData,			
		}
	}

}

module.exports = Game;