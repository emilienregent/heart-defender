/**
 * Player.js
 **/

function Player(parentObj)
{
	this.sprite = null;
	this.x = 512 - (48/2);
	this.y = 300 - (64/2);
	this.w = 48;
	this.h = 64;
	this.speed = 100;
	this.projectileType = 'explosion'; // ('fleche', ...)
	this.parentObj = parentObj;
	this.life = GameConf.player.LIFE;
	this.score = 0;
	this.weapon = 'arrow';
	this.shot = false;

	this.auraRotation = 0;

	this.haveSaySomething = false;

	/**
	 * Initialization
	 **/

	this.init = function() 
	{
		// On stocke une instance unique du joueur dans le tableau qui référence toutes les instances de sprites du jeu
		this.parentObj.sprites['img/player'] = IM.getInstance('img/player');
		this.sprite = this.parentObj.sprites['img/player'];
		this.sprite.animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 64,
			sx : 48,
			sy : 64 * 2,
			animDirection : 'left2right',
			alternate : true,
			animByFrame : 7
		});

		// On prépare aussi une instance du joueur mort pour le futur game over
		this.parentObj.sprites['img/player_dead'] = IM.getInstance('img/player_dead');

		// On prépare aussi une instance d'aura pour chaque type de sortilège
		for(p in ProjectileConf) {
			var aura = ProjectileConf[p].aura;
			this.parentObj.sprites[aura] = IM.getInstance(aura);
		}

		// Affiche le nombre de coeurs
		this.display();
	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		deltaTime = ( Date.now() - deltaTime ) / 1000;
		var p = this;

		// Animate aura
		p.auraRotation -= 0.1 * deltaTime;

		// bas
		if (input.keyboard.down) {
			if (p.y + p.h + p.speed * deltaTime < HEIGHT) p.y += p.speed * deltaTime;
			p.sprite.animation.sy = 64 * 2;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// haut
		if (input.keyboard.up) {
			if (p.y - p.speed * deltaTime > 0) p.y -= p.speed * deltaTime;
			p.sprite.animation.sy = 0;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// gauche
		if (input.keyboard.left) {
			if (p.x - p.speed * deltaTime > 0 ) p.x -= p.speed * deltaTime;
			p.sprite.animation.sy = 64 * 3;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// droite
		if (input.keyboard.right) {
			if (p.x + p.w + p.speed * deltaTime < WIDTH) p.x += p.speed * deltaTime;
			p.sprite.animation.sy = 64;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// Si aucune touche directionnelle n'est activée, la position 'sx' du sprite joueur passe au centre (position arrêt : 48) et on pause l'animation
		if (!input.keyboard.left && !input.keyboard.up && !input.keyboard.right && !input.keyboard.down) {
			p.sprite.animation.sx = 48;
			p.sprite.pauseAnimation = true;
		}

		deltaTime = Date.now();
	};

	/**
	 * Dessin du joueur
	 **/
	this.render = function() {

		this.renderAura();

		IM.drawImage(ctx, this.sprite, this.x, this.y);

	};

	// Show player aura
	this.renderAura = function() {
		var aura = ProjectileConf[this.weapon].aura;
		ctx.globalAlpha = 0.4;
		ctx.save();
		ctx.translate(this.x + this.w/2, this.y + this.h/2);
		ctx.rotate(this.auraRotation);
		IM.drawImage(ctx, 
			this.parentObj.sprites[aura], 
			- this.parentObj.sprites[aura].width/2, 
			- this.parentObj.sprites[aura].height/2);
		ctx.restore();
		ctx.globalAlpha = 1;
	}

	/**
	 * Affiche les éléments de HUD du joueur
	 **/
	this.display = function() {
		/*Affiche les vies du joueur*/
		var html = "";
		for(var i = 0; i < this.life; i++) {
			html += GameConf.player.LIFE_DISPLAY;
		}
		$$('#life').innerHTML = html;

		/*Affiche le score du joueur*/
		$$('#score').innerHTML = this.score;
	}

	/**
	 * Test si l'ennemi doit être visible ou non
	 **/
	this.isVisible = function(e) {
		if(this.parentObj.bossMode !== undefined || this.parentObj.MEnemy.vanishMode === true) {
			return true;
		}
		return distance(e, this) <= GameConf.player.RADIUS;
	}

	/**
	 * Inflige une perte de point de vie au joueur
	 **/
	this.damage = function() {
		// Ajout d'une tâche de sang à l'endroit de la collision (pke c gorre, mdrrr)
		this.parentObj.MTache.add(this);
		if(--this.life <= 0) {
			// Remplacement du sprite player par le sprite player_killed
			this.sprite = this.parentObj.sprites['img/player_dead'];
			//Let's kill it, he deserved to be !
			this.kill();
		}
		else {
			// Feedback sur la perte d'une vie
			this.parentObj.MMessage.add({
				message : '-1 UP',
				x : this.x + (this.w/2),
				y : this.y - 30,
				speed : 2,
				decrementOpacity : .02,
				fontSize : 30,
				color :'red',
				direction : 'down',
				blur : 5
			});
			if (!this.haveSaySomething) {
				var rand_msg = ['Heaven doors are almost there !','Damn ! I Hate monsters …','These creatures are angry !'].pickup();
				var that = this;
				this.parentObj.MMessage.add({
					message : rand_msg,
					x : (this.x + (this.w/2)),
					y : this.y - 30,
					speed : 4,
					decrementOpacity : .02,
					fontSize : 18,
					color :'#f3b32f',
					direction : 'up',
					callback : function() {
						that.haveSaySomething = false;
					}
				});
				this.haveSaySomething = true;
			}
			
			//déclanche son hit 
			soundLoader.cachedSounds[ "cut" ].play();
			soundLoader.cachedSounds[ "growl" ].play();
		}
		this.display();
	};

	/**
	 * Ajoute une vie au joueur
	 **/
	this.addLife = function() {
		this.life++;
		// Feedback sur la perte d'une vie
		this.parentObj.MMessage.add({
			message : '+1 UP',
			x : this.x + (this.w/2),
			y : this.y - 30,
			speed : 2,
			decrementOpacity : .02,
			fontSize : 30,
			color :'red',
			direction : 'up',
			blur : 5
		});
		this.display();
	}

	/**
	 * Modifie l'arme du joueur
	 **/
	this.changeWeapon = function(weapon) {
		this.weapon = weapon;
	}

	/**
	 * Fait mourir le joueur
	 **/
	this.kill = function() {
		
		//arrête son thème
		soundLoader.cachedSounds[ "theme" ].pause();
		
		//met tout les sons de coeur en pause 
		soundLoader.cachedSounds[ "heart_slow2" ].pause();
		soundLoader.cachedSounds[ "heart_fast2" ].pause();
		soundLoader.cachedSounds[ "heart_fast3" ].pause();
			
		//déclanche son de mort
		soundLoader.cachedSounds[ "death" ].play();
		soundLoader.cachedSounds[ "heart_stop" ].play();
		
		this.parentObj.gameover();
	};

	/**
	 * Donne le coin le plus proche du joueur selon le découpage choisi (grille de 3x3, grille de 2x2, etc)
	 **/

	this.localize = function() {
	 	// Colonne 
	 	var cell = {
	 		w : Math.round(WIDTH/3),
	 		h : Math.round(HEIGHT/3)
	 	};
	 	var h_align = '';
	 	var v_align = '';

	 	var c = 1;
	 	while (this.x > (cell.w * c) && this.x < WIDTH)
	 		c++;

	 	switch (c) {
	 		case 1 : 	h_align = 'Left';
	 					break;

	 		case 2 : 	h_align = 'Center';
	 					break;

	 		case 3 : 	h_align = 'Right';
	 					break;

	 		default : 	h_align = 'Undefined';
	 	}

	 	var r = 1;
	 	while (this.y > (cell.h * r) && this.y < HEIGHT)
	 		r++;

	 	switch (r) {
	 		case 1 : 	v_align = 'Top';
	 					break;

	 		case 2 : 	v_align = 'Middle';
	 					break;

	 		case 3 : 	v_align = 'Bottom';
	 					break;

	 		default : 	v_align = 'Undefined';
	 	}



	 	return v_align+h_align;
	 }

}