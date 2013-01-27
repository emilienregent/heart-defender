/**
 * Enemy.js
 **/

function Enemy(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Enemy - Enemy parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les ennemis à animer..
	this.enemies = [];
	this.lastPop = +new Date();	

	this.vanishMode = false;
	
	/**
	 * Ajoute un ennemi dans la liste
	 **/

	this.add = function(spawn) 
	{

		if(typeof spawn.x === "undefined" || typeof spawn.y === "undefined") {
			warn("Add Enemy - Spawn point coords are missing");
			warn(spawn);
			return null;
		}

		var spriteNames = ['img/ennemi_vert', 'img/ennemi_marron'],
			chosenSprite = (game.bossMode === true)  
							? 'img/ennemi_vert' 
							: (game.bossMode === false) 
								? 'img/ennemi_vert'
								:spriteNames.pickup(),
			conf = GameConf.enemies[chosenSprite],
			sprite, target = undefined;

		if(this.parentObj.bossMode === true) {
			spawn.x = this.parentObj.boss.x + this.parentObj.boss.w/2;
			spawn.y = this.parentObj.boss.y + this.parentObj.boss.h/2;
		}

		sprite = IM.getInstance(chosenSprite);
		sprite.animation = new IIG.Animation(conf.animation);
		var enemy = {
			sprite : sprite,
			x : spawn.x - (conf.width/2),
			y : spawn.y - (conf.height/2),
			w : conf.width,
			h : conf.height,
			speed : conf.speed,
			score : conf.SCORE_BASE,
			opacity : 0.3,
			isSpotted : false, //test si l'ennemi à déjà été repéré
			spriteName: chosenSprite,
			target : target
		};
		this.enemies.push(enemy);

		return enemy;
	};

	/**
	 * Fonction qui s'occupe des déplacements du joueur principal
	 **/
	this.animate = function() {

		for (var i = 0, c = this.enemies.length; i < c; i++) {
			var e = this.enemies[i];

			var target = this.parentObj.player;

			if(typeof e.target === "undefined" || e.target === undefined) {
				var heart = this.parentObj.heart;
				if (heart.alive) {
					if (lineDistance({x:e.x,y:e.y},{x:heart.x,y:heart.y}) < lineDistance({x:e.x,y:e.y},{x:target.x,y:target.y}))
						target = heart;
				}
			} else {
				target = e.target;
			}


			var angle,
				distX = (target.x + target.w/2) - (e.x + e.w/2),
				distY = (target.y + target.h/2) - (e.y + e.h/2);

			angle = Math.atan2(distY, distX);
			e.x += Math.cos(angle) * e.speed;
			e.y += Math.sin(angle) * e.speed;


			if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
				// Test la direction de l'ennemi
				if(Math.cos(angle) <= 0) {
					// gauche
					if(e.sprite.spriteName !== "img/boss_projectile"){
						e.sprite.animation.sy = e.h * 3;
					}
					e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
				}
				else if(Math.cos(angle) > 0) {
					// droite
					if(e.sprite.spriteName !== "img/boss_projectile"){
						e.sprite.animation.sy = e.h;
					}
					e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
				}
			}
			else {
				if(Math.sin(angle) <= 0) {
					// haut
					if(e.sprite.spriteName !== "img/boss_projectile"){
						e.sprite.animation.sy = 0;
					}
					e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
				}
				else if(Math.sin(angle) > 0) {
					// bas
					if(e.sprite.spriteName !== "img/boss_projectile"){
						e.sprite.animation.sy = e.h * 2;
					}
					e.sprite.pauseAnimation = false; // Comme le joueur bouge, on remet l'animation en marche
				}
			}

			// Collision avec le joueur
			if(collide(e, target)) {
				if(this.kill(i, false)) {
					if(typeof target.damage !== "undefined") {
						target.damage();
					}
					this.parentObj.MTache.add(e);
					--c;
				}
			} else if(collide(e, this.parentObj.player)) {
				if(this.kill(i, false)) {
					if(typeof this.parentObj.player.damage !== "undefined") {
						this.parentObj.player.damage();
					}
					this.parentObj.MTache.add(e);
					--c;
				}

				//déclanche son monstre hit
				if ( ( typeof ( this.parentObj.bossMode ) === "undefied" ) )
					soundLoader.cachedSounds[ "growl" ].play();
				else
					soundLoader.cachedSounds[ "growl2" ].play();
				
			} else if((e.x + e.w < 0 || e.x > WIDTH || e.y + e.h < 0 || e.y > HEIGHT) && game.bossMode === undefined) {
				this.kill(i, false);
				--c;
			}
		}

		// Comportements du mode boss
		if(this.vanishMode === true && this.enemies.length === 0) {
			this.unlishTenia();
		} else if(game.bossMode === false && this.enemies.length === 0) {
			game.boss = new Boss(game);
			game.boss.init();
			game.bossMode = true;
		}

	};

	/**
	 * Dessin de l'ennemi
	 **/
	this.render = function() {

		for (var i = 0, c = this.enemies.length; i < c; i++) {
			var e = this.enemies[i];
			if(this.parentObj.player.isVisible(e) === false) {	
				ctx.globalAlpha = e.opacity;
			}
			else
			{
				//declanche son de shock si on voit l'ennemi pour la première fois
				if ( !e.isSpotted && Math.random() < 0.2 && ( typeof ( this.parentObj.bossMode ) === "undefied" ) )
					soundLoader.cachedSounds[ "heart_shock" ].play();
			
				e.isSpotted = true;
			}
			
			IM.drawImage(ctx, e.sprite, e.x, e.y);
			ctx.globalAlpha = 1;

			// DEBUG : cadre rectangulaire de l'ennemi
			// ctx.strokeStyle = 'pink';
			// ctx.lineWidth = 2;
			// ctx.strokeRect(e.x, e.y, e.w, e.h);
		}

	};

	/**
	 * Drop a bonus
	 **/
	this.drop = function(e) {
		var rand = Math.random();
		var drop = null;
		var sum = 0;

		for ( i in GameConf.bonus ) {
			sum += GameConf.bonus[i].drop_rate;
			if (rand <= sum ) {
				if (this.parentObj.player.weapon != GameConf.bonus[i].effect) 
					drop = GameConf.bonus[i];
				break;
			}
		}

		if (drop != null) 
			this.parentObj.MBonus.add(e,drop);
	};

	/**
	 * Détruit l'instance d'ennemi
	 **/
	this.kill = function(index, withScore) {
		var enemy = this.enemies[index];

		// Si la mort de l'ennemi doit générer du score
		if(withScore === true && this.parentObj.player.life > 0) {
			var score = this.parentObj.score(enemy);
			if(score > 0) {
				this.parentObj.MScore.add({
						score : score,
						x : enemy.x + enemy.w/2,
						y : enemy.y,
						speed : 3,
						decrementOpacity : 0.04
				});
			}
			this.drop(enemy);
		}
		var enemiesLen = this.enemies.length;
		// On tue l'instance du sprite pour ne pas surcharger le garbage collector...
		IM.killInstance(enemy.sprite);
		// ... et on splice l'ennemi actuel 'i'
		this.enemies.splice(index, 1);

		if(enemiesLen - 1 === this.enemies.length)
		{
			//if enemy mort déclanche son destruction 
			soundLoader.cachedSounds[ "destroy" ].play();
			
			return true;
		}
		else {
			warn("Kill Enemy - Can't kill enemy");
			return false;
		}
	}

	/**
	 * Fait la moyenne des ennemis présents en arène
	 **/
	this.averageInGame = function() {
		var enemiesInGame = {};
		for (var i = 0, c = this.enemies.length; i < c; i++) {
			var e = this.enemies[i];

			if(typeof enemiesInGame[e.spriteName] === "undefined") {
				enemiesInGame[e.spriteName] = 1;				
			} else {
				enemiesInGame[e.spriteName] ++;
			}
		}

		var averageInGame = 0;
		var enemiesInGameLen = 0;
		for(e in enemiesInGame) {
			averageInGame += enemiesInGame[e];
			enemiesInGameLen ++;
		}

		return Math.ceil(averageInGame / enemiesInGameLen);
	}

	this.maximumInGame = function() {
		// FORMULA => ((S+C)/T)/2+(PV*I)
		// S => score
		// C => coefficient de difficulté
		// T => durée de la partie
		// PV => points de vie du joueur
		// I => intervalle initial

		if(this.vanishMode === true) {
			return 0;
		} else if(game.bossMode === true) {
			return 100;
		}

		return Math.ceil(((this.parentObj.player.score + GameConf.DIFFICULTY_COEF) / (TIME / 1000)) / 2) * 
			(this.parentObj.player.life * GameConf.arena.INTERVAL_MAX);
	}

	this.getSpawnInterval = function() {
		// FORMULA => I - (((M-NC)+B3)/(10-B4))
		// I => intevalle initial
		// M => nombre maximum de créatures en arène
		// NC => nombre de créature dans l'arène

		var diviseur = (10 - this.parentObj.player.life) || 1;
		var interval = Math.floor(GameConf.arena.INTERVAL_MAX - 
			((this.maximumInGame() - this.enemies.length) + GameConf.DIFFICULTY_COEF) / diviseur);

		if(interval > GameConf.arena.INTERVAL_MIN && interval < GameConf.arena.INTERVAL_MAX) {
			return interval;
		} else {
			return Math.floor(rand(GameConf.arena.INTERVAL_MIN, GameConf.arena.INTERVAL_MAX));
		}
	}

	this.vanishBeforeTenia = function() {

		this.vanishMode = true;

		// Parse les ennemis
		for (var i = 0, c = this.enemies.length; i < c; i++) {
			var e = this.enemies[i];
			/*Sélectionne le coin opposé à l'ennemi*/
			var leavePoint = {
				x : (e.x < WIDTH/2)
					? -e.w
					: WIDTH + e.w,
				y : (e.y < HEIGHT/2)
					? -e.h
					: HEIGHT + e.h,
				w : e.w,
				h : e.h
			}
			// Augmente la vitesse des ennemis
			this.enemies[i].speed = GameConf.enemies['img/ennemi_vert'].speed * 3;
			// Fais quitter la zone aux ennemis en modifiant leur cible
			this.enemies[i].target = leavePoint;
		}
	}


	this.unlishTenia = function() {
		this.vanishMode = false;
		// BOSS
		game.bossMode = false;

		this.enemies = [];

		
		// Crée 8 ennemis
		for (var i = 0, c = 12, iSpawn = 0, iPaddingSpawn = 0; i < c; i++) {

			if(iSpawn >= 4) {
				iSpawn = 0;
				iPaddingSpawn ++;
			}

			// Définis un point de spawn
			var spawn = {};
			// Définis une nouvelle cible de déplacement
			var target = {};
			switch(iSpawn) {
				case 0 : spawn = {x: (-GameConf.arena.SPAWN_PADDING/2)*iPaddingSpawn, y:HEIGHT/2};
						target = {x: (WIDTH/2) + 45/2, y: (HEIGHT / 2)-45};
				break;
				case 1 : spawn = {x: WIDTH/2 - 45, y:(-GameConf.arena.SPAWN_PADDING/2)*iPaddingSpawn - 200};
						target = {x: (WIDTH/2) - (45*2), y: (HEIGHT / 2)};
				break;
				case 2 : spawn = {x: WIDTH + (GameConf.arena.SPAWN_PADDING/2)*iPaddingSpawn, y:HEIGHT/2 - 45};
						target = {x: (WIDTH/2) - (45*2), y: (HEIGHT / 2) - 45};
				break;
				case 3 : spawn = {x: WIDTH/2, y:HEIGHT + (GameConf.arena.SPAWN_PADDING/2)*iPaddingSpawn + 200};
						target = {x: (WIDTH/2) - (45*2), y: (HEIGHT / 2)-(45*3)};
				break;
			}

			target.w = 128;
			target.h = 128;

			var enemy = this.add(spawn);
			// Modifie leur cible
			enemy.target = target;
			enemy.speed = GameConf.enemies['img/ennemi_vert'].speed * 6;

			iSpawn++;
		}
	}

}