/**
 * Boss.js
 **/

function Boss(parentObj)
{
	this.sprite = null;
	this.x = WIDTH/2 - (128/2);
	this.y = HEIGHT/2 - (128/2);
	this.w = 128;
	this.h = 128;
	this.opacity = 0.3;
	this.parentObj = parentObj;
	this.life = GameConf.boss.LIFE;
	this.score = 5432;

	/**
	 * Initialization
	 **/

	this.init = function() 
	{
		// On stocke une instance unique du joueur dans le tableau qui référence toutes les instances de sprites du jeu
		this.parentObj.sprites['img/boss'] = IM.getInstance('img/boss');
		this.parentObj.sprites['img/boss_hit'] = IM.getInstance('img/boss_hit');
		this.sprite = this.parentObj.sprites['img/boss'];
		this.sprite.animation = new IIG.Animation({
			sWidth : 128,
			sHeight : 128,
			animByFrame : 8
		});
	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		this.x = WIDTH/2 - this.w/2;
		this.y = HEIGHT/2  - this.h/2;
		this.opacity = 1;

	};

	/**
	 * Dessin du joueur
	 **/
	this.render = function() {

		ctx.globalAlpha = this.opacity;
		IM.drawImage(ctx, this.sprite, this.x, this.y);

		ctx.globalAlpha = 1;
		
		// DEBUG : Show boss rectangle
		// ctx.strokeStyle = 'green';
		// ctx.lineWidth = 2;
		// ctx.strokeRect(this.x, this.y, this.w, this.h);

	};

	this.damage = function() {
		// Ajout d'une tâche de sang à l'endroit de la collision (pke c gorre, mdrrr)
		this.parentObj.MTache.add(this);
		if(--this.life <= 0) {
			this.parentObj.MTache.add(this);			
			//Let's kill it, he deserved to be !
			this.kill();
		}
	};

	this.kill = function() {
		this.parentObj.MTache.add(this);
		this.parentObj.MTache.add(this);
		this.parentObj.MTache.add(this);

		var score = this.parentObj.score(this);
		if(score > 0) {
			this.parentObj.MScore.add({
					score : score,
					x : this.x + this.w/2,
					y : this.y,
					speed : 3,
					decrementOpacity : 0.04
			});
		}

		//if enemy mort déclanche son destruction 
		soundLoader.cachedSounds[ "destroy" ].play();

		GameConf.boss.SPAWN = Math.ceil(GameConf.boss.SPAWN * 1.5);
		GameConf.DIFFICULTY_COEF += 10;

		this.parentObj.bossMode = undefined;
	}

}