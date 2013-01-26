/**
 * Tache.js
 **/

function Tache(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Tache - Tache parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les tâches à animer..
	this.taches = [];

	/**
	 * Fonction qui ajoute une tache dans la liste
	 **/
	this.add = function(target) {

		var spriteNames = [];

		if(target instanceof Player) {
			spriteNames = ['img/blood-player', 'img/blood-player2'];
		} else {
			spriteNames = ['img/blood', 'img/blood2'];
		}

		var chosenSprite = spriteNames.pickup(),
			conf = TacheConf[chosenSprite],
			sprite;

		sprite = IM.getInstance(chosenSprite);
		sprite.animation = new IIG.Animation(conf.animation);

		var x = target.x;
		var y = target.y;
		if(chosenSprite === 'img/blood2') {
			x -= sprite.animation.sWidth/2;
			y -= sprite.animation.sHeight/2;
		} else if(target instanceof Player) {
			x += target.w/2;
		}

		this.taches.push({
			sprite : sprite,
			x : x,
			y : y,
			w : conf.width,
			h : conf.height,
			tar : target
		});

	};

	/**
	 * Fonction qui s'occupe de faire disparaître les tâches qui ont terminée leur animation
	 **/
	this.animate = function() {

		for (var i = 0, c = this.taches.length; i < c; i++) {
			var t = this.taches[i];

			if(typeof t.tar !== "undefined" && t.tar instanceof Player) {
				t.x = t.tar.x + t.tar.w /2;
				t.y = t.tar.y;
			}

			if (t.sprite.animation.sx >= t.sprite.width - t.sprite.animation.sWidth)
				if (this.kill( i ))
					--c;
		}

	};

	/**
	 * Dessin des taches
	 **/
	this.render = function() {

		for (var i = 0, c = this.taches.length; i < c; i++) {
			var t = this.taches[i];

			IM.drawImage(ctx, t.sprite, t.x, t.y);
		}
	};

	/**
	 * Détruit l'instance de tache
	 **/
	this.kill = function(index) {
		var tache = this.taches[index];
		var tachesLen = this.taches.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		IM.killInstance(tache.sprite);
		// ... et on splice la tache actuelle 'i'
		this.taches.splice(index, 1);

		if(tachesLen - 1 === this.taches.length){
			return true;
		}
		else {
			warn("Kill Tache - Can't kill tache");
			return false;
		}
	}
}