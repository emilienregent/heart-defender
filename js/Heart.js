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
	this.lastPop = +new Date();

	this.w = GameConf.heart.WIDTH;
	this.h = GameConf.heart.HEIGHT;

	this.health = '';	
	this.lifeTime = '';
	this.x = '';
	this.y = '';
	this.protected = false;
	this.tick = +new Date();

	this.alive = false;

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

		this.x = spawn.x - (GameConf.heart.WIDTH/2);
		this.y = spawn.y - (GameConf.heart.HEIGHT/2);
		this.tick = +new Date();
		this.health = GameConf.heart.HEALTH;
		this.lifeTime = GameConf.heart.LIFE_TIME;

		this.alive = true;
	}

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		if (distance(this, this.parentObj.player) <= GameConf.player.RADIUS) 
			this.protected = true;
		else
			this.protected = false;

		if(interval(this.tick, 1) === true) {
			this.lifeTime--;
			this.tick = new Date().getTime();
		}

		if (this.lifeTime === 0) 
			this.kill();

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
		if (this.alive)
			drawRect(ctx, 'rgba(255,0,0,1)', this.x, this.y, this.w, this.h);
	};

	/**
	 * Inflige une perte de point de vie au joueur
	 **/
	this.damage = function() {
		if(--this.health <= 0) {
			this.kill();
		}
		// this.display();
	};

	/**
	 * Détruit l'instance d'ennemi
	 **/
	this.kill = function() {
		if (this.alive) {
			// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
			// IM.killInstance(this.sprite);

			if (this.protected && this.health > 0) 
				this.parentObj.player.addLife();

			this.alive = false;
			this.lastPop = +new Date();
		}
	};
}