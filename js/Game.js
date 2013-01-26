/**
 * Game.js
 **/

function Game()
{
	
	/**
	 * Properties
	**/

	// Joueur principal
	this.player = new Player(this);

	// Cible souris
	this.cible = {
		sprite : null,
		x : 512 - (31/2),
		y : 300 - (31/2),
		w : 31,
		h : 31
	};

	// Projectiles
	this.projectile = new Projectile(this);

	// Ce tableau 'associatif' stockera toutes les instances de sprites
	this.sprites = [];

	/**
	 * Initialization
	 **/

	this.init = function() 
	{
		
		// ====== JOUEUR ======
		// On stocke une instance unique du joueur dans le tableau qui référence toutes les instances de sprites du jeu
		this.player.init();

		// ====== CIBLE ======
		// On stocke une instance unique de la cible dans le tableau qui référence toutes les instances de sprites du jeu
		this.sprites['img/target'] = IM.getInstance('img/target');
		this.cible.sprite = this.sprites['img/target'];

	};
	
	/**
	 * Animation Methods
	 **/
	
	this.animate = function() {

		// On écoute les évènement input clavier et souris
		input.listen();

		// On anime le joueur
		this.player.animate();
		// On anime la target
		this.animateTarget();
		// Ecouteur pour créer un tir ?
		this.listenProjectiles();
		this.projectile.animate();

		//debug(input.mouse.x + ', ' + input.mouse.y);

	};

	this.listenProjectiles = function() {
		if (input.mouse.click) {
			// On créé un nouveau projectile aux coordonnées x, y du player, et en direction de x, y de la souris lorsqu'on a cliqué
			this.projectile.add(
				this.player.x + this.player.w/2,
				this.player.y + this.player.h/2,
				input.mouse.x,
				input.mouse.y
			);
		}
	};

	/**
	 * Fonction qui gère la position de la cible via la position souris
	 **/
	this.animateTarget = function() {

		this.cible.x = input.mouse.x - (this.cible.w/2);
		this.cible.y = input.mouse.y - (this.cible.h/2);

	}

	/**
	 * Drawing Methods
	 **/

	this.render = function() {

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		this.player.render();
		this.projectile.render();
		this.renderTarget();

	};

	

	/**
	 * Dessin de la cible (target)
	 **/
	this.renderTarget = function() {

		ctx.drawImage(this.cible.sprite.data, this.cible.x, this.cible.y);

	};

	/**
	 * LOOP update
	 **/

	this.update = function() {

		this.animate();
		this.render();

	};
}