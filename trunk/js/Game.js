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

	// Ombre d'obscurité très dark sidious stress panic mode
	this.shadow = {
		sprite : null,
		x : 0,
		y : 0
	};

	// Cible souris
	this.cible = {
		sprite : null,
		x : 512 - (31/2),
		y : 300 - (31/2),
		w : 31,
		h : 31
	};

	// Manager d'ennemis
	this.MEnemy = new Enemy(this);

	// Manager de projectiles
	this.MProjectile = new Projectile(this);
	


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

		// ====== SHADOW ======
		// On stocke une instance unique de la shadow dans le tableau qui référence toutes les instances de sprites du jeu
		this.sprites['img/shadow'] = IM.getInstance('img/shadow');
		this.shadow.sprite = this.sprites['img/shadow'];

	};
	
	/**
	 * Animation Methods
	 **/
	
	this.animate = function() {

		// On écoute les évènement input clavier et souris
		input.listen();

		// On anime le joueur
		this.player.animate();
		// On anime la shadow en synchronisation avec les positions du joueur
		this.animateShadow();
		// On anime la target
		this.animateTarget();
		// On anime les ennemis
		this.MEnemy.animate();

		// Ecouteur pour créer un tir ?
		this.listenProjectiles();
		// On anime les projectiles
		this.MProjectile.animate();

	};

	this.listenProjectiles = function() {

		this.player.projectileType = ['fleche', 'explosion'].pickup();
		//this.player.projectileType = 'explosion';

		if (input.mouse.click) {
			// On créé un nouveau projectile aux coordonnées x, y du player, et en direction de x, y de la souris lorsqu'on a cliqué
			this.MProjectile.add(
				this.player.projectileType, // indique le type de projectile que le joueur a à cet instant
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

	};

	/**
	 * Fonction qui anime la shadow en synchronisation avec les positions du joueur
	 **/
	this.animateShadow = function() {

		this.shadow.x = (this.player.x + this.player.w/2) - this.shadow.sprite.width/2;
		this.shadow.y = (this.player.y + this.player.h/2) - this.shadow.sprite.height/2;

	};

	/**
	 * Drawing Methods
	 **/

	this.render = function() {

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		// On affiche le joueur
		this.player.render();
		// On affiche les ennemis
		this.MEnemy.render();
		// On affiche les projectiles
		this.MProjectile.render();
		// On affiche la shadow box
		//this.renderShadow();
		// On affiche la cible
		this.renderTarget();

	};

	

	/**
	 * Dessin de la cible (target)
	 **/
	this.renderTarget = function() {

		ctx.drawImage(this.cible.sprite.data, this.cible.x, this.cible.y);

	};

	this.renderShadow = function() {

		// ctx.drawImage(this.shadow.sprite.data, this.shadow.x, this.shadow.y);

	};

	/**
	 * LOOP update
	 **/

	this.update = function() {

		if(interval(this.MEnemy.lastPopEnemy, GameConf.arena.SPAWN_TIME) === true && 
			this.MEnemy.enemies.length < GameConf.arena.MAX_ENEMY) 
		{
			this.generateEnemies();
		}

		this.animate();
		this.render();
	};

	/**
	 * Generation aléatoire des ennemis
	 **/

	this.generateEnemies = function() {

		/*Sélectionne le coin opposé au joueur*/
		var spawn = {
			x : (this.player.x > WIDTH/2)
				? GameConf.arena.SPAWN_PADDING
				: WIDTH - GameConf.arena.SPAWN_PADDING,
			y : (this.player.y > HEIGHT/2)
				? GameConf.arena.SPAWN_PADDING
				: HEIGHT - GameConf.arena.SPAWN_PADDING
		}

		/*Et ajoute un coefficient aléatoire pour décaler le point de spawn des coins*/
		/*/!\ N'ajoute un coefficient que sur un seul axe pour que le spawn reste près des murs*/
		/*Horizontal*/
		if(Math.round(rand(0, 1)) === 0) {
			randomX = rand(0, WIDTH - GameConf.arena.SPAWN_PADDING)
			if(spawn.x === GameConf.arena.SPAWN_PADDING) {
				spawn.x += randomX;
			}
			else {
				spawn.x -= randomX
			}
		/*Vertical*/
		} else {
			randomY = rand(0, HEIGHT - GameConf.arena.SPAWN_PADDING);
			if(spawn.y === GameConf.arena.SPAWN_PADDING) {
				spawn.y += randomY;
			}
			else {
				spawn.y -= randomY
			}
		}

		this.MEnemy.add(spawn);
		this.MEnemy.lastPopEnemy = +new Date();

	}

	/**
	 * Déclenche le game over
	 **/
	this.gameOver = function() {
		warn("Game Over");
	}
}