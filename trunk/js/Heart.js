/**
 * Heart.js
 **/

function Heart(parentObj) {

	if(!(parentObj instanceof Game)) {
		warn("Construct Heart - Heart parent isn't instance of Game");
		return null;
	}

	var sprite = IM.getInstance('img/jewel');
	sprite.animation = new IIG.Animation({
		sWidth : GameConf.heart.WIDTH,
		sHeight : GameConf.heart.HEIGHT,
		sx : 0,
		sy : 0,
		animDirection : 'left2right',
		alternate : true,
		animByFrame : 6
	});

	this.parentObj = parentObj;
	this.lastPop = +new Date();

	this.w = GameConf.heart.WIDTH;
	this.h = GameConf.heart.HEIGHT;
	this.opacity = 0.3;

	this.health = '';	
	this.lifeTime = '';
	this.x = '';
	this.y = '';
	this.protected = false;
	this.tick = +new Date();
	this.sprite = sprite;

	this.alive = false;
	

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
			
		//if en vie déclanche le battement
		if ( this.alive )
		{		
			//met tout les sons en pause 
			soundLoader.cachedSounds[ "heart_slow2" ].pause();
			soundLoader.cachedSounds[ "heart_fast2" ].pause();
			soundLoader.cachedSounds[ "heart_fast3" ].pause();
		
			var dist  = distance( this, this.parentObj.player );
			var sound = ( dist < 400 ) ? soundLoader.cachedSounds[ "heart_fast2" ] : soundLoader.cachedSounds[ "heart_slow2" ]; 
			
			if ( dist < 80 )
				sound = soundLoader.cachedSounds[ "heart_fast3" ];
				
			var diag = Math.sqrt( Math.pow( canvas.width, 2 ) + Math.pow( canvas.height, 2 ) );
			sound.volume = 0.4 + 0.6 * ( 1 - dist/diag );
			
			sound.play();
		}
		else
		{
			//met tout les sons en pause 
			soundLoader.cachedSounds[ "heart_slow2" ].pause();
			soundLoader.cachedSounds[ "heart_fast2" ].pause();
			soundLoader.cachedSounds[ "heart_fast3" ].pause();
		}
	};

	/**
	 * Dessin du coeur
	 **/
	this.render = function() {
		if (this.alive) {
			if(this.parentObj.player.isVisible(this) === false) {
				// ctx.globalAlpha = this.opacity;
			}
			// drawRect(ctx, 'rgba(255,0,0,1)', this.x, this.y, this.w, this.h);
			IM.drawImage(ctx, this.sprite, this.x, this.y);
			ctx.globalAlpha = 1;
		}
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
		
		//déclanche la collection du coeur 
		soundLoader.cachedSounds[ "heart_fade" ];
	};
}