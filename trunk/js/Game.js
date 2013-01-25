/**
 * Game.js
 **/

function Game()
{
	
	/**
	 * Properties
	**/

	// Joueur principal
	this.player = {
		sprite : null,
		x : 512 - (48/2),
		y : 300 - (64/2),
		w : 48,
		h : 64,
		speed : 3
	};

	// Cible souris
	this.target = {
		sprite : null,
		x : 512 - (31/2),
		y : 300 - (31/2),
		w : 31,
		h : 31
	};

	// Ce tableau 'associatif' stockera toutes les instances de sprites
	this.sprites = [];

	/**
	 * Initialization
	 **/

	this.init = function() 
	{
		
		// ====== JOUEUR ======
		// On stocke une instance unique du joueur dans le tableau qui référence toutes les instances de sprites du jeu
		this.sprites['img/bob'] = IM.getInstance('img/bob');
		this.player.sprite = this.sprites['img/bob'];
		this.player.sprite.animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 64,
			sx : 48,
			sy : 64 * 2,
			animDirection : 'left2right',
			alternate : true,
			animByFrame : 7
		});

		// ====== CIBLE ======
		// On stocke une instance unique de la cible dans le tableau qui référence toutes les instances de sprites du jeu
		this.sprites['img/target'] = IM.getInstance('img/target');
		this.target.sprite = this.sprites['img/target'];

	};
	
	/**
	 * Animation Methods
	 **/
	
	this.animate = function() {

		// On écoute les évènement input clavier et souris
		input.listen();

		// On anime le joueur
		this.animatePlayer();
		// On anime la target
		this.animateTarget();

		debug(input.mouse.x + ', ' + input.mouse.y);

	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animatePlayer = function() {

		// bas
		if (input.keyboard.down) {
			this.player.y += this.player.speed;
			this.player.sprite.animation.sy = 64 * 2;
			this.player.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// haut
		if (input.keyboard.up) {
			this.player.y -= this.player.speed;
			this.player.sprite.animation.sy = 0;
			this.player.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// gauche
		if (input.keyboard.left) {
			this.player.x -= this.player.speed;
			this.player.sprite.animation.sy = 64 * 3;
			this.player.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// droite
		if (input.keyboard.right) {
			this.player.x += this.player.speed;
			this.player.sprite.animation.sy = 64;
			this.player.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
		}

		// Si aucune touche directionnelle n'est activée, la position 'sx' du sprite joueur passe au centre (position arrêt : 48) et on pause l'animation
		if (!input.keyboard.left && !input.keyboard.up && !input.keyboard.right && !input.keyboard.down) {
			this.player.sprite.animation.sx = 48;
			this.player.sprite.pauseAnimation = true;
		}

	};

	/**
	 * Fonction qui gère la position de la cible via la position souris
	 **/
	this.animateTarget = function() {

		this.target.x = input.mouse.x - (this.target.w/2);
		this.target.y = input.mouse.y - (this.target.h/2);

	}

	/**
	 * Drawing Methods
	 **/

	this.render = function() {

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		this.renderPlayer();
		this.renderTarget();

	};

	/**
	 * Dessin du joueur
	 **/
	this.renderPlayer = function() {

		IM.drawImage(ctx, this.player.sprite, this.player.x, this.player.y);

	};

	/**
	 * Dessin de la cible (target)
	 **/
	this.renderTarget = function() {

		ctx.drawImage(this.target.sprite.data, this.target.x, this.target.y);

	};

	/**
	 * LOOP update
	 **/

	this.update = function() {

		this.animate();
		this.render();

	};
}