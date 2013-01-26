/**
 * Projectile.js
 **/

function Projectile(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Projectile - Projectile parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les projectiles tirés à animer..
	this.projectiles = [];

	/**
	 * Fonction qui ajoute un projectile dans la liste
	 **/
	this.add = function(type, x, y, xDestination, yDestination) {

		var sprite,
			conf;

		// On vérifie le type de projectile que l'on veut tirer à cet instant
		switch (type) {
			
			// Flèche de base
			case 'fleche' :
				sprite = IM.getInstance('img/fleche');
				conf = ProjectileConf.Arrow;
				break;

			// Explosion
			case 'explosion' :
				sprite = IM.getInstance('img/explosion');
				conf = ProjectileConf.Explosion;
				sprite.animation = new IIG.Animation({
					sx : 0,
					sy : 0,
					sWidth : 77,
					sHeight : 79,
					animByFrame : 3,
					alternate : true
				});
				break;

			// (Par défaut :) Flèche de base
			default :
				sprite = IM.getInstance('img/fleche');
				conf = ProjectileConf.Arrow;
				break;
		}

		// Calcul de la rotation du sprite en fonction de la position d'origine et de la destination
		var angle = Math.atan2(yDestination - y, xDestination - x);

		this.projectiles.push({
			sprite : sprite,
			x : x,
			y : y,
			xOrigin : x,
			yOrigin : y,
			xDestination : xDestination,
			yDestination : yDestination,
			rotation : angle,
			w : sprite.width,
			h : sprite.height,
			speed : conf.speed,
			maxDistance : conf.maxDistance
		});

	};

	/**
	 * Fonction qui s'occupe des déplacements des projectiles
	 **/
	this.animate = function() {

		var angle,
			dist,
			kill;

		for (var i = 0, c = this.projectiles.length; i < c; i++) {
			var p = this.projectiles[i];

			angle = Math.atan2(p.yDestination - p.yOrigin, p.xDestination - p.xOrigin);
			p.x += Math.cos(angle) * p.speed;
			p.y += Math.sin(angle) * p.speed;

			// Si ce projectile a atteint sa destination, on le vire du tableau..
			if((p.x < 0 || p.x >= WIDTH || p.y < 0 || p.y >= HEIGHT) || // Si déjà, le projectile sort de la map, on peut le kill..
				   (distance(p.x, p.y, p.xOrigin, p.yOrigin) > p.maxDistance)){
				if(this.kill(i)) {
					--c;
				}
			}
		}
	};

	/**
	 * Dessin des projectiles
	 **/
	this.render = function() {

		for (var i = 0, c = this.projectiles.length; i < c; i++) {
			var p = this.projectiles[i];

			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rotation);
			IM.drawImage(ctx, p.sprite, 0, 0);
			ctx.restore();
		}
	};

	/**
	 * Détruit l'instance de projectile
	 **/
	this.kill = function(index) {
		var projectile = this.projectiles[index];
		var projectilesLen = this.projectiles.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		IM.killInstance(projectile.sprite);
		// ... et on splice le projectil actuel 'i'
		this.projectiles.splice(index, 1);

		if(projectilesLen - 1 === this.projectiles.length){
			return true;
		}
		else {
			warn("Kill Projectile - Can't kill projectile");
			return false;
		}
	}
}