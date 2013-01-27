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

		if(typeof ProjectileConf[type] === "undefined") {
			warn("Add Projectile - Type " + type + " isn't a valid projectile");
			return null;
		}

		var sprite,
			conf = ProjectileConf[type];

		// Calcul de la rotation du sprite en fonction de la position d'origine et de la destination
		var angle = Math.atan2(yDestination - y, xDestination - x);
		var addDate = +new Date();
		if(conf.category === "toTarget") {
			angle = 0;
		}

		// On vérifie le type de projectile que l'on veut tirer à cet instant
		switch (type) {
			
			// Flèche de base
			case 'arrow' :
				sprite = IM.getInstance('img/fire_arrow');
				sprite.animation = new IIG.Animation({
					sx : 0,
					sy : 0,
					sWidth : 72,
					sHeight : 49,
					animByFrame : 3,
					alternate : true
				});
				break;
				break;

			// explosion
			case 'explosion' :
				sprite = IM.getInstance('img/explosion');
				sprite.animation = new IIG.Animation({
					sx : 0,
					sy : 0,
					sWidth : 77,
					sHeight : 79,
					animByFrame : 3,
					alternate : true
				});
				break;
			// lightning
			case 'lightning' :
				sprite = IM.getInstance('img/lightning');
				sprite.animation = new IIG.Animation({
					sx : 0,
					sy : 0,
					sWidth : 57,
					sHeight : 130,
					animByFrame : 5,
					alternate : false
				});
				break;

			// (Par défaut :) Flèche de base
			default :
				sprite = IM.getInstance('img/fleche');
				conf = ProjectileConf.arrow;
				break;
		}

		this.projectiles.push({
			sprite : sprite,
			x : x,
			y : y,
			xOrigin : x,
			yOrigin : y,
			xDestination : xDestination,
			yDestination : yDestination,
			rotation : angle,
			w : conf.width,
			h : conf.height,
			speed : conf.speed,
			maxDistance : conf.maxDistance,
			category : conf.category,
			lifetime : conf.lifetime,
			addDate : addDate
		});

	};

	/**
	 * Fonction qui s'occupe des déplacements des projectiles
	 **/
	this.animate = function() {

		var angle,
			alreadyKilled = false;

		for (var i = 0, c = this.projectiles.length; i < c; i++) {
			var p = this.projectiles[i];

			if(p.category === 'toCoords') {
				angle = Math.atan2(p.yDestination - p.yOrigin, p.xDestination - p.xOrigin);
				p.x += Math.cos(angle) * p.speed;
				p.y += Math.sin(angle) * p.speed;
			}

			// Si ce projectile touche un ennemi, on supprime l'ennemi et le projectile
			for (var j = 0, d = this.parentObj.MEnemy.enemies.length; j < d; j++) {
				var e = this.parentObj.MEnemy.enemies[j];

				// Modification des coordonnées du player pour gérer la rotation
				// du sprite correctement
				var pTemp = {
					x : p.x - p.w/2,
					y : p.y - p.h/2,
					w : p.w,
					h : p.h
				};

				if (collide(pTemp, e)) {

					// Ajout d'une tâche de sang à l'endroit de la collision (pke c gorre, mdrrr)
					this.parentObj.MTache.add(e);

					if(typeof p.lifetime === "undefined" || p.lifetime <= 0) {
						if (this.kill( i )) --c;
					}
						if (this.parentObj.MEnemy.kill( j, true )) --d;
					alreadyKilled = true;
				}
			}

			if(this.parentObj.bossMode === true) {
				var e = this.parentObj.boss;
				// Modification des coordonnées du player pour gérer la rotation
				// du sprite correctement
				var pTemp = {
					x : p.x - p.w/2,
					y : p.y - p.h/2,
					w : p.w,
					h : p.h
				};

				if (collide(pTemp, e)) {

					// Ajout d'une tâche de sang à l'endroit de la collision (pke c gorre, mdrrr)
					this.parentObj.MTache.add(e);

					if(typeof p.lifetime === "undefined" || p.lifetime <= 0) {
						if (this.kill( i )) --c;
					}
					this.parentObj.boss.damage( j, true );

					if(this.kill( i )) --c;
				}
			}
			
			// Si ce projectile a atteint sa destination, on le vire du tableau..
			if (!alreadyKilled)
			{
				var coords = {x:p.x, y:p.y};
				var coordsOrigin = {x:p.xOrigin, y:p.yOrigin};
				if ((p.x < 0 || p.x >= WIDTH || p.y < 0 || p.y >= HEIGHT) || // Si déjà, le projectile sort de la map, on peut le kill..
			      (distance(coords, coordsOrigin) > p.maxDistance) || // Sinon s'il atteint sa distance maximum, on le kill
			      (p.category === "toTarget" && interval(p.addDate, p.lifetime) === true) )  
				{
					if(this.kill( i )) --c;
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
			IM.drawImage(ctx, p.sprite, -p.w/2, -p.h/2);
			ctx.restore();
		}
	};

	/**
	 * Détruit l'instance de projectile
	 **/
	this.kill = function(index) {
		var projectile = this.projectiles[index];
		if(typeof projectile === "undefined") {
			warn("Kill Projectile - Can't kill projectile");
			return false;
		}
		var projectilesLen = this.projectiles.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		projectile.sprite = IM.killInstance(projectile.sprite);
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