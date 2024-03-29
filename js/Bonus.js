/**
 * Bonus.js
 **/

function Bonus(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Bonus - Bonus parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les bonus actuellement sur la carte...
	this.bonus = [];

	/**
	 * Ajoute un bonus dans la liste
	 **/

	this.add = function(spawn, bonus) {

		if(typeof spawn.x === "undefined" || typeof spawn.y === "undefined") {
			warn("Add Enemy - Spawn point coords are missing");
			warn(spawn);
			return null;
		}

		this.bonus.push({
			x : spawn.x - (26/2),
			y : spawn.y - (26/2),
			w : 26,
			h : 26,
			opacity : 0.3,
			color: bonus.color,
			effect: bonus.effect,
			sprite : IM.getInstance(bonus.sprite),
			message : bonus.message,
			interval : bonus.interval,
			pop : new Date().getTime()
		});
	};

	/**
	 * Fonction qui s'occupe de mettre à jour les infos et animer l'objet
	 **/
	this.animate = function() {
		/*Collision avec le joueur*/
		for (var i = 0, c = this.bonus.length; i < c; i++) {
			var e = this.bonus[i];
			if (interval(e.pop,e.interval)) {
				if(this.disappear(i,true) === true) {
					c --;
				}
			}
			if(collide(e, this.parentObj.player)) {
				this.parentObj.player.changeWeapon(e.effect);
				if(this.disappear(i) === true) {
					c --;
				}
				
				//déclanche son collection bonus
				soundLoader.cachedSounds[ "powerup" ].play();
			}
		}
	};

	/**
	 * Dessin de l'objet
	 **/
	this.render = function() {

		for (var i = 0, c = this.bonus.length; i < c; i++) {
			var e = this.bonus[i];
			if(this.parentObj.player.isVisible(e) === false) {
				ctx.globalAlpha = e.opacity;
			}
			IM.drawImage(ctx, e.sprite, e.x, e.y);
			// drawRect(ctx, e.color, e.x, e.y, e.w, e.h);
			ctx.globalAlpha = 1;
		}

	};

	/**
	 * Détruit l'instance de l'objet
	 **/
	this.disappear = function(index,noTalk) {
		var bonus = this.bonus[index];

		noTalk = noTalk == undefined ? false : noTalk;

		var that = this;

		if (!this.parentObj.player.haveSaySomething && !noTalk) {
			this.parentObj.MMessage.add({
				message : bonus.message,
				x : this.parentObj.player.x + ( this.parentObj.player.w/2 ),
				y : this.parentObj.player.y - 30,
				speed : 2,
				decrementOpacity : .02,
				fontSize : 18,
				color :'f3b32f',
				direction : 'up',
				callback : function() {
							that.parentObj.player.haveSaySomething = false;
						}
			});
			this.parentObj.player.haveSaySomething = true;
		}
		
		var bonusLen = this.bonus.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		// IM.killInstance(enemy.sprite);
		// ... et on splice l'objet actuel 'i'
		this.bonus.splice(index, 1);

		if(bonusLen - 1 === this.bonus.length) {
			return true;
		}
		else {
			warn("Disappear Bonus - Can't play David Copperfield. Error with the length");
			return false;
		}
	}
}