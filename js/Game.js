/**
 * Game.js
 **/

function Game()
{
	/**
	 * Properties
	**/

	this.that = this;

	// Joueur principal
	this.player = null;

	// Ombre d'obscurité très dark sidious stress panic mode
	this.shadow = {};

	// Cible souris
	this.cible = {};
	this.stop = true;
	this.cleared = true;

	// Manager d'ennemis
	this.MEnemy = null;

	// Manager de projectiles
	this.MProjectile = null;

	// Manager de projectiles
	this.MBonus = null;

	// Coeur (bonus)
	this.heart = null;


	// Ce tableau 'associatif' stockera toutes les instances de sprites
	this.sprites = [];

	/**
	 * Initialization
	 **/

	this.init = function() 
	{

		this.stop = false;
		this.cleared = false;

		// ====== JOUEUR ======
		this.player = new Player(this.that);
		// On stocke une instance unique du joueur dans le tableau qui référence toutes les instances de sprites du jeu
		this.player.init();

		// ====== CIBLE ======
		// Cible souris
		this.cible = {
			sprite : null,
			x : 512 - (32/2),
			y : 300 - (32/2),
			w : 32,
			h : 32
		};
		// On stocke une instance unique de la cible dans le tableau qui référence toutes les instances de sprites du jeu
		this.sprites['img/target'] = IM.getInstance('img/target');
		this.cible.sprite = this.sprites['img/target'];
		this.cible.sprite.animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 48,
			animByFrame : 3
		});

		// ====== SHADOW ======
		// Ombre d'obscurité très dark sidious stress panic mode
		this.shadow = {
			sprite : null,
			x : 0,
			y : 0
		};
		
		// On stocke une instance unique de la shadow dans le tableau qui référence toutes les instances de sprites du jeu
		this.sprites['img/shadow'] = IM.getInstance('img/shadow');
		this.shadow.sprite = this.sprites['img/shadow'];

		this.MEnemy = new Enemy(this.that);
		this.MProjectile = new Projectile(this.that);
		this.MBonus = new Bonus(this.that);
		this.MTache = new Tache(this.that);
		this.heart = new Heart(this.that);
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
		// On anime le coeur
		this.heart.animate();

		// Ecouteur pour créer un tir ?
		this.listenProjectiles();
		// On anime les projectiles
		this.MProjectile.animate();
		// On anime les taches
		this.MTache.animate();
		// On anime les ennemis
		this.MEnemy.animate();
		// On anime le coeur
		this.MBonus.animate();
	};

	this.listenProjectiles = function() {

		this.player.projectileType = ['arrow', 'explosion', 'lightning'].pickup();
		// this.player.projectileType = 'lightning';
		var conf = ProjectileConf[this.player.projectileType];
		if (input.mouse.click) {
			/*Détermine le type de destination selon la catégorie du projectile*/
			// Initialise l'origine et la destination au centre du joueur
			var origine = {x:this.player.x + this.player.w/2, y:this.player.y + this.player.h/2};
			var destination = {x:this.player.x + this.player.w/2, y:this.player.y + this.player.h/2};
			// Dans le cas d'un projectile sur coordonnées
			if(conf.category === "toCoords") {
				// Récupère les coordonnées de la souris pour le point de destination
				destination.x = input.mouse.x;
				destination.y = input.mouse.y;
			}
			// Dans le cas d'un projectile sur cible
			else if(conf.category === "toTarget"){
				var destinationTmp = null;
				// Parse le tableau d'ennemis
				for(var i = 0, c = this.MEnemy.enemies.length; i < c; i++) {
					// Récupère l'entrée du tableau
					var e = this.MEnemy.enemies[i];
					// Passe à l'ennemi suivant si il est hors de portée
					if(lineDistance({x:this.player.x,y:this.player.y},{x:e.x,y:e.y}) > conf.maxDistance) {
						continue;
					}
					// Récupère la première entrée du tableau à bonne distance pour servir de destination de référence
					else if(destinationTmp === null) {
						destinationTmp ={
							x : e.x + e.w/2,
							y : e.y
						} 
					}
					// Si la nouvelle entrée est plus proche que celle actuellement sauvegardée
					if (lineDistance({x:this.player.x,y:this.player.y},{x:e.x,y:e.y}) 
						< lineDistance({x:this.player.x,y:this.player.y},{x:destinationTmp.x,y:destinationTmp.y})) {
						// Stocke l'entrée en destination
                    	destinationTmp ={
							x : e.x + e.w/2,
							y : e.y
						}
                   	}
                }
                // Dans le cas d'un projectile cible la destination est aussi l'origine
                if(destinationTmp !== null) {
               		origine = destination = destinationTmp;
               	}
               	else {
               		return false;
               	}
			}

			// On créé un nouveau projectile aux coordonnées x, y du player, et en direction de x, y de la souris lorsqu'on a cliqué
			this.MProjectile.add(
				this.player.projectileType, // indique le type de projectile que le joueur a à cet instant
				origine.x,
				origine.y,
				destination.x,
				destination.y
			);
			
			switch ( this.player.projectileType )
			{
				case "arrow" :
					//déclancher son fleche	
					soundLoader.cachedSounds[ "arrow" ].play();
				break;
				
				case "explosion" :
					//déclancher son feu
					var fire = soundLoader.cachedSounds[ "fire" ];
					fire.currentTime = 0.15;
					fire.play();
				break;
			}
			
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

		// Pour le headtrackr, mais pour l'instant c'est bancal
		//this.shadow.x = (FACE.x + FACE.w/2) - this.shadow.sprite.width/2;
		//this.shadow.y = (FACE.y + FACE.h/2) - this.shadow.sprite.height/2;

	};

	/**
	 * Drawing Methods
	 **/

	this.render = function() {

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		// On affiche le coeur
		this.heart.render();
		// On affiche les bonus
		this.MBonus.render();
		// On affiche le joueur
		this.player.render();
		// On affiche les ennemis
		this.MEnemy.render();
		// On affiche les projectiles
		this.MProjectile.render();
		// On affiche les taches
		this.MTache.render();
		// On affiche la shadow box
		// this.renderShadow();
		// On affiche la cible
		this.renderTarget();

	};

	

	/**
	 * Dessin de la cible (target)
	 **/
	this.renderTarget = function() {

		IM.drawImage(ctx, this.cible.sprite, this.cible.x, this.cible.y);

	};

	this.renderShadow = function() {

		ctx.drawImage(this.shadow.sprite.data, this.shadow.x, this.shadow.y);

	};

	/**
	 * LOOP update
	 **/

	this.update = function() {

		if(interval(this.MEnemy.lastPop, GameConf.arena.SPAWN_TIME) === true && 
			this.MEnemy.enemies.length < GameConf.arena.MAX_ENEMY) 
		{
			this.generateEnemies();
		}

		if(interval(this.heart.lastPop, GameConf.heart.SPAWN_TIME) === true &&
			!this.heart.alive )
		{
			this.heart.generate();
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
		this.MEnemy.lastPop = +new Date();

	}

	this.score = function(enemy) {
		this.player.score += Math.ceil(enemy.score * (this.MEnemy.enemies.length / this.player.life));
		this.player.display();
	}

	/**
	 * Déclenche le game over
	 **/
	this.gameover = function() {
		this.stop = true;
		this.showGameover();
	}

	this.showGameover = function() {
		$$("#gameover").innerHTML = GameConf.menu.GAMEOVER_DISPLAY.replace(/%SCORE%/, this.player.score);
		$$("#gameover").style.display = "block";
		$$('#score').style.display = 'none';
		$$('body').style.cursor = 'default';
	}

	this.hideGameover = function() {
		$$('#gameover').style.display = 'none';
		$$('#score').style.display = 'block';
		$$('body').style.cursor = 'none';
	}

	/**
	 * Clear properties of current game
	 **/
	this.clear = function() {
		// this.player.clear();
		this.player = undefined;
		// this.MEnemy.clear();
		this.MEnemy = undefined;
		// this.MProjectile.clear();
		this.MProjectile = undefined;
		this.MTache = undefined;

		this.shadow = {};
		this.cible = {};
		this.sprites = [];

		this.cleared = true;
	}
}
