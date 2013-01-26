/**
 * Enemy.js
 **/

function Enemy(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Enemy - Enemy parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les ennemis à animer..
	this.enemies = [];
	this.lastPopEnemy = +new Date();

	

	/**
	 * Ajoute un ennemi dans la liste
	 **/

	this.add = function(spawn) 
	{

		if(typeof spawn.x === "undefined" || typeof spawn.y === "undefined") {
			warn("Add Enemy - Spawn point coords are missing");
			return null;
		}

		var sprite = IM.getInstance('img/enemy');
		sprite.animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 64,
			sx : 48,
			sy : 64 * 2,
			animDirection : 'left2right',
			alternate : true,
			animByFrame : 7
		});

		this.enemies.push({
			x : spawn.x - (48/2),
			y : spawn.y - (64/2),
			w : 48,
			h : 64,
			speed : 3,
			sprite : sprite			
		});
	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		for (var i = 0, c = this.enemies.length; i < c; i++) {
			var e = this.enemies[i];

			var angle,
				distX = (this.parentObj.player.x + this.parentObj.player.w/2) - (e.x + e.w/2),
				distY = (this.parentObj.player.y + this.parentObj.player.h/2) - (e.y + e.h/2);

			angle = Math.atan2(distY, distX);
			e.x += Math.cos(angle) * e.speed;
			e.y += Math.sin(angle) * e.speed;

			// Test la direction de l'ennemi
			if(Math.cos(angle) <= 0) {
				// gauche
				e.sprite.animation.sy = 64 * 3;
				e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			}
			else if(Math.cos(angle) > 0) {
				// droite
				e.sprite.animation.sy = 64;
				e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			}
			else if(Math.sin(angle) <= 0) {
				// haut
				e.sprite.animation.sy = 0;
				e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			}
			else if(Math.sin(angle) > 0) {
				// bas
				e.sprite.animation.sy = 64 * 2;
				e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
			}

			if(collide(e, this.parentObj.player)) {
				if(this.kill(i)) {
					--c;
				}
			}
		}
	};

	/**
	 * Dessin de l'ennemi
	 **/
	this.render = function() {

		for (var i = 0, c = this.enemies.length; i < c; i++) {
			var e = this.enemies[i];
			IM.drawImage(ctx, e.sprite, e.x, e.y);
		}

	};

	/**
	 * Détruit l'instance d'ennemi
	 **/
	this.kill = function(index) {
		var enemy = this.enemies[index];
		var enemiesLen = this.enemies.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		IM.killInstance(enemy.sprite);
		// ... et on splice l'ennemi actuel 'i'
		this.enemies.splice(index, 1);

		if(enemiesLen - 1 === this.enemies.length){
			return true;
		}
		else {
			warn("Kill Enemy - Can't kill enemy");
			return false;
		}
	}
}