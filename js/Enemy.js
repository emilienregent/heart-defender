/**
 * Enemy.js
 **/

function Enemy(parentObj, spawn)
{

	if(!(parentObj instanceof Game)) {
		warn("Enemy.js - Enemy parent isn't instance of Game");
		return null;
	}

	if(typeof spawn.x === "undefined" || typeof spawn.y === "undefined") {
		warn("Enemy.js - Spawn point coords are missing");
		return null;
	}	

	this.sprite = null;
	this.x = spawn.x - (48/2);
	this.y = spawn.y - (64/2);
	this.w = 48;
	this.h = 64;
	this.speed = 3;
	this.parentObj = parentObj;
	this.moveDirection = 'idle';

	/**
	 * Initialization
	 **/

	this.init = function() 
	{
		// On stocke une instance unique du joueur dans le tableau qui référence toutes les instances de sprites du jeu
		this.parentObj.sprites['img/enemy'] = IM.getInstance('img/enemy');
		this.sprite = this.parentObj.sprites['img/enemy'];
		this.sprite.animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 64,
			sx : 48,
			sy : 64 * 2,
			animDirection : 'left2right',
			alternate : true,
			animByFrame : 7
		});

		return this;
	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		var p = this;

		// Test la direction de l'ennemi
		switch(this.moveDirection) {
			// bas
			case 'bottom' : 
				if (p.y + p.h + p.speed < HEIGHT) p.y += p.speed;
				p.sprite.animation.sy = 64 * 2;
				p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			break;
			// haut
			case 'top' :
				if (p.y - p.speed > 0) p.y -= p.speed;
				p.sprite.animation.sy = 0;
				p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			break;
			// gauche
			case 'left' :
				if (p.x - p.speed > 0 ) p.x -= p.speed;
				p.sprite.animation.sy = 64 * 3;
				p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			break;
			// droite
			case 'right' :
				if (p.x + p.w + p.speed < WIDTH) p.x += p.speed;
				p.sprite.animation.sy = 64;
				p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			break;
			// Si aucune touche directionnelle n'est activée, la position 'sx' du sprite joueur passe au centre (position arrêt : 48) et on pause l'animation
			default : 
				p.sprite.animation.sx = 48;
				p.sprite.pauseAnimation = true;
			break;
		}
	};

	/**
	 * Dessin de l'ennemi
	 **/
	this.render = function() {

		IM.drawImage(ctx, this.sprite, this.x, this.y);

	};
}