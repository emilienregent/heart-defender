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
	this.speed = 3;
	this.projectileType = 'explosion'; // ('fleche', ...)
	this.parentObj = parentObj;
	this.life = GameConf.player.LIFE;
	this.score = 0;

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

		// Affiche le nombre de coeurs
		this.display();
	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		var p = this;

		// bas
		if (input.keyboard.down) {
			if (p.y + p.h + p.speed < HEIGHT) p.y += p.speed;
			p.sprite.animation.sy = 64 * 2;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// haut
		if (input.keyboard.up) {
			if (p.y - p.speed > 0) p.y -= p.speed;
			p.sprite.animation.sy = 0;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// gauche
		if (input.keyboard.left) {
			if (p.x - p.speed > 0 ) p.x -= p.speed;
			p.sprite.animation.sy = 64 * 3;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// droite
		if (input.keyboard.right) {
			if (p.x + p.w + p.speed < WIDTH) p.x += p.speed;
			p.sprite.animation.sy = 64;
			p.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// Si aucune touche directionnelle n'est activée, la position 'sx' du sprite joueur passe au centre (position arrêt : 48) et on pause l'animation
		if (!input.keyboard.left && !input.keyboard.up && !input.keyboard.right && !input.keyboard.down) {
			p.sprite.animation.sx = 48;
			p.sprite.pauseAnimation = true;
		}

	};

	/**
	 * Dessin du joueur
	 **/
	this.render = function() {

		/*ctx.fillStyle = 'white';
		ctx.shadowColor = 'white';
		ctx.shadowBlur = 20;
		ctx.beginPath();
		ctx.arc(this.x + this.w/2, this.y + this.h/2, 5, 0, Math.PI*2, true);
		ctx.fill();
		ctx.closePath();*/
		IM.drawImage(ctx, this.sprite, this.x, this.y);

		ctx.shadowColor = '';
		ctx.shadowBlur = 0;

	};

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
	 * Inflige une perte de point de vie au joueur
	 **/
	this.damage = function() {
		if(--this.life <= 0) {
			this.kill();
		}
		this.display();
	};

	/**
	 * Fait mourir le joueur
	 **/
	this.kill = function() {
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		IM.killInstance(this.sprite);
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