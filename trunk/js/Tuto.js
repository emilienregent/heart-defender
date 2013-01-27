/**
 * Tuto.js
 **/

function Tuto()
{
	/**
	 * Properties
	 **/

	this.that = this;
	this.stop = true;
	this.waiting = true;

	this.sprites = [];

	this.player = {
		sprite : null,
		x : 300,
		y : 300,
		w : 48,
		h : 64,
		speed : 1.5
	};

	this.CURRENTSTEP = 1;
	this.BUTTON = false;

	// ===

	this.messages = {
		welcome : {
			msg : ['Welcome in'],
			size : 32,
			color : 'white',
			x : 0,
			y : 0,
		},
		player : {
			msg : ['This is your player.',
					'You can move it with WASD or arrows.',
					'',
					'Go, move it ...'],
			size : 24,
			color : 'white',
			x : -1000, // For hide
			y : -1000
		}
	};

	this.logo = {
		sprite : null,
		x : 0,
		y : 75,
		alpha : 0
	};

	/**
	 * Initialization
	 **/

	this.init = function() {
		this.waiting = false;
		this.stop = false;
		this.cleared = false;

		$$('#gameCanvas').className = 'tuto';

		// Sprites
		this.sprites['img/player'] = IM.getInstance('img/player');
		this.sprites['img/logo'] = IM.getInstance('img/logo');
		this.sprites['img/player'].animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 64,
			sx : 48,
			sy : 64 * 2,
			alternate : true,
			animByFrame : 8
		});

		this.player.sprite = this.sprites['img/player'];
		this.logo.sprite = this.sprites['img/logo'];

	};

	/**
	 * Animation methods
	 **/

	this.animate = function() {

		switch (this.CURRENTSTEP) {
			case 1:
				this.animate1();
				break;
		}

		if (this.BUTTON)
			this.animateButton();
		this.animatePlayer();

	};

	this.animatePlayer = function() {

		var p = this.player;

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
		else {
			this.BUTTON = true;
		}

	}

	this.animateButton = function() {
		if (this.BUTTON && input.mouse.click) {
			if (collide({
				x : 600 - 30,
				y : 1024 - 200,
				w : 200,
				h : 30
			},{
				x : input.mouse.x,
				y : input.mouse.y,
				w : 1,
				h : 1
			})) {
				this.CURRENTSTEP += 1;
			}
		}
	}

	this.animate1 = function() {

		var w = this.messages.welcome;
		w.x = WIDTH/2 - this.getTextSize(w.msg)/2;

		this.logo.x = WIDTH/2 - this.logo.sprite.width/2 - 20;

		if (w.y < 75)					w.y += 1;
		else if (this.logo.alpha < 1) 	this.logo.alpha += .02;
		else {
			this.logo.alpha = 1;

			this.messages.player.x = 375;
			this.messages.player.y = 300;
		}

	}


	/**
	 * Drawing methods
	 **/

	this.render = function() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		switch (this.CURRENTSTEP) {
			case 1:
				this.render1();
				break;
		}

		if (this.BUTTON)
			this.renderButton();

		// Dessin du player
		IM.drawImage(ctx, this.player.sprite, this.player.x, this.player.y);
	};

	this.renderButton = function() {
		log('render button');
		ctx.fillStyle = '#d31f1e';
		ctx.fillRect(600 - 30, 1024 - 200, 200, 30);
		ctx.fillStyle = 'white';
		ctx.font = '24px lucida_handwritingitalic';
		ctx.fillText('CONTINUE', 600 - 25, 1024 - 180);
	};

	this.render1 = function() {
		var w = this.messages.welcome;
		ctx.fillStyle = w.color;
		ctx.font = w.size + 'px lucida_handwritingitalic';
		this.fillText(w.msg, w.x, w.y, w.size);

		ctx.globalAlpha = this.logo.alpha;
		ctx.drawImage(this.logo.sprite.data, this.logo.x, this.logo.y);
		ctx.globalAlpha = 1;

		var w = this.messages.player;
		ctx.fillStyle = w.color;
		ctx.font = w.size + 'px lucida_handwritingitalic';
		this.fillText(w.msg, w.x, w.y, w.size);
	}
	
	/**
	 * LOOP update
	 **/
	
	this.update = function() {
		this.animate();
		this.render();
	};

	this.getTextSize = function(array_texts) {
		var maxWidth = 0;
		for (var i = 0, c = array_texts.length; i < c; i++) {
			var measure = ctx.measureText(array_texts[i]).width;
			maxWidth = (maxWidth < measure) ? measure : maxWidth;
		}
		return maxWidth;
	}

	this.fillText = function(array_texts, x, y, size) {
		for (var i = 0, c = array_texts.length; i < c; i++) {
			ctx.fillText(array_texts[i], x, y+(i*size));
		}
	}


}