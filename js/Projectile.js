/**
 * Projectile.js
 **/

function Projectile(parentObj)
{
	this.parentObj = parentObj;
	// Tableaux qui contient tous les projectiles tirés à animer..
	this.projectiles = [];

	/**
	 * Fonction qui ajoute un projectile dans la liste
	 **/
	this.add = function(x, y, xDestination, yDestination) {

		var sprite = IM.getInstance('img/fleche');

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
			speed : ProjectileConf.Arrow.speed,
			maxDistance : ProjectileConf.Arrow.maxDistance
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
			kill = (p.x < 0 || p.x >= WIDTH || p.y < 0 || p.y >= HEIGHT) || // Si déjà, le projectile sort de la map, on peut le kill..
				   (distance(p.x, p.y, p.xOrigin, p.yOrigin) > p.maxDistance);

			if (kill) {
				// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
				p.sprite = IM.killInstance(p.sprite);
				// ... et on splice le projectile actuel 'i'
				this.projectiles.splice(i, 1);
				// ... sans oublier de décrémenter 'c'
				--c;
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
			ctx.drawImage(p.sprite.data, 0, 0);
			ctx.restore();
		}

	};
}