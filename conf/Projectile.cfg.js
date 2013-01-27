
var ProjectileConf = {
	arrow : {
		speed : 10, // vitesse des flèches
		maxDistance : 1024, // distance maximale où peuvent aller les flèches
		width : 72,
		height : 49,
		category : 'toCoords'
	},
	explosion : {
		speed :8,
		maxDistance : 200,
		lifetime : .5,
		width : 77,
		height : 79,
		category : 'toCoords'
	},
	lightning : {
		speed :5,
		maxDistance : 132.5,
		lifetime : .5,
		width : 57,
		height : 130,
		category : 'toTarget'
	}
};