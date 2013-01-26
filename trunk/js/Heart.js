/**
 * Heart.js
 **/

function Heart(parentObj) {

	if(!(parentObj instanceof Game)) {
		warn("Construct Heart - Heart parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les ennemis à animer..
	this.hearts = [];
	this.lastPop = +new Date();

	

	/**
	 * Ajoute un ennemi dans la liste
	 **/

	this.add = function(spawn) 	{

		if(typeof spawn.x === "undefined" || typeof spawn.y === "undefined") {
			warn("Add Heart - Spawn point coords are missing");
			return null;
		}

		// var sprite = IM.getInstance('img/enemy');
		// sprite.animation = new IIG.Animation({
		// 	sWidth : 48,
		// 	sHeight : 64,
		// 	sx : 48,
		// 	sy : 64 * 2,
		// 	animDirection : 'left2right',
		// 	alternate : true,
		// 	animByFrame : 7
		// });

		this.hearts.push({
			x : spawn.x - (GameConf.heart.WIDTH/2),
			y : spawn.y - (GameConf.heart.HEIGHT/2),
			w : GameConf.heart.WIDTH,
			h : GameConf.heart.HEIGHT,
			health : GameConf.heart.HEALTH,
			protected : false,
			lifeTime : 	GameConf.heart.LIFE_TIME,
			tick : new Date().getTime()
		});
	};

	this.generate = function() {

		/* Sélectionne un emplacement où le joueur n'est pas */
		var playerPosition = this.parentObj.player.localize();

		var widthPadding = Math.round((WIDTH/3)/2 - GameConf.heart.WIDTH/2);
		var heightPadding = Math.round((HEIGHT/3)/2 - GameConf.heart.HEIGHT/2);

		var availablePosition = {
			TopLeft : { x : widthPadding, y : heightPadding},
			BottomLeft : { x : widthPadding, y : HEIGHT - heightPadding},
			MiddleCenter : { x : Math.round(WIDTH/2), y : Math.round(HEIGHT/2)},
			TopRight : { x : WIDTH - widthPadding, y : heightPadding},
			BottomRight : { x : WIDTH - widthPadding, y : HEIGHT - heightPadding}
		};

		var pos = playerPosition;

		while (pos === playerPosition)
			pos = Object.keys(availablePosition).pickup();

		var spawn = availablePosition[pos];		

		this.add(spawn);
	}

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {
		for (var i = 0, c = this.hearts.length; i < c; i++) {
			var h = this.hearts[i];
			if(interval(h.tick, 1) === true) {
				h.lifeTime--;
				h.tick = new Date().getTime();
			}

			if (h.lifeTime === 0) 
				this.kill(i);
		}

		// for (var i = 0, c = this.enemies.length; i < c; i++) {
		// 	var e = this.enemies[i];

		// 	var angle,
		// 		distX = (this.parentObj.player.x + this.parentObj.player.w/2) - (e.x + e.w/2),
		// 		distY = (this.parentObj.player.y + this.parentObj.player.h/2) - (e.y + e.h/2);

		// 	angle = Math.atan2(distY, distX);
		// 	e.x += Math.cos(angle) * e.speed;
		// 	e.y += Math.sin(angle) * e.speed;

		// 	// Test la direction de l'ennemi
		// 	if(Math.cos(angle) <= 0) {
		// 		// gauche
		// 		e.sprite.animation.sy = 64 * 3;
		// 		e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		// 	}
		// 	else if(Math.cos(angle) > 0) {
		// 		// droite
		// 		e.sprite.animation.sy = 64;
		// 		e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		// 	}
		// 	else if(Math.sin(angle) <= 0) {
		// 		// haut
		// 		e.sprite.animation.sy = 0;
		// 		e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		// 	}
		// 	else if(Math.sin(angle) > 0) {
		// 		// bas
		// 		e.sprite.animation.sy = 64 * 2;
		// 		e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		// 	}

		// 	if(collide(e, this.parentObj.player)) {
		// 		if(this.kill(i)) {
		// 			--c;
		// 		}
		// 	}
		// }
	};

	/**
	 * Dessin du coeur
	 **/
	this.render = function() {

		for (var i = 0, c = this.hearts.length; i < c; i++) {
			var e = this.hearts[i];
			// IM.drawImage(ctx, e.sprite, e.x, e.y);
			drawRect(ctx, 'rgba(255,0,0,1)', e.x, e.y, e.w, e.h);
		}

	};

	/**
	 * Détruit l'instance d'ennemi
	 **/
	this.kill = function(index) {
		var hear = this.hearts[index];
		var heartsLen = this.hearts.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		IM.killInstance(hear.sprite);
		// ... et on splice l'ennemi actuel 'i'
		this.hearts.splice(index, 1);

		this.lastPop = +new Date();

		if(heartsLen - 1 === this.hearts.length){
			return true;
		}
		else {
			warn("Kill Heart - Can't kill hear");
			return false;
		}
	}
}