/**
 * Game.cfg.js
 **/

var GameConf = 
{
	arena : {
		SPAWN_PADDING : 50,	/*Coefficient pour décaler le point de spawn des murs*/	
		SPAWN_TIME : 3,	/*Délai de génération des éléments de l'arène*/
		INTERVAL_MIN : 1, /*Délai minimum de génération de base pour les ennemis*/
		INTERVAL_MAX : 3, /*Délai maximum de génération de base pour les ennemis*/
	},
	player : {
		LIFE : 3,			/*Points de vie du joueur en début de partie*/
		LIFE_DISPLAY : '<img src="img/jewel_ico.png"/>',	/*Balise pour afficher une vie du joueur*/
		RADIUS : 132.5		/*Rayon du cercle de lumière*/
	},
	boss : {
		LIFE : 10, /*Points de vie du boss (correspond aux nb de fois qu'il peut être touché avt de crever)*/
	},
	enemies : {
		'img/ennemi_vert' : {
			animation : {
				sWidth : 45,
				sHeight : 41,
				sy : 41 * 2,
				alternate : true,
				animByFrame : 7
			},
			width : 45,
			height : 41,
			speed : 1,
			SCORE_BASE : 20
		},
		'img/ennemi_marron' : {
			animation : {
				sWidth : 47,
				sHeight : 52,
				sy : 52 * 2,
				alternate : true,
				animByFrame : 7
			},
			width : 47,
			height : 52,
			speed : 0.5,
			SCORE_BASE : 10
		}
	},
	menu : {
		/*Bloc HTML de gameover*/
		GAMEOVER_DISPLAY : '<h2>Game Over</h2>'+
							'<h3>Darkness overkilled you !</h3>'+
							'<p>Your score is %SCORE%.</p>'+
							'<button onclick="restartGame()">Try to defeat the darkness ... again</button>'
	},
	heart : {
		SPAWN_TIME : 5, /*Délai de génération du bonus*/
		MAX : 1, /*Nombre maximum de bonus*/
		WIDTH : 48, /*Largeur du bonus*/
		HEIGHT : 48, /*Hauteur du bonus*/
		HEALTH : 5, /*Santé du bonus*/
		LIFE_TIME : 10 /*Durée de vie du bonus*/
	},
	bonus : {
		bonus_1 : {
			drop_rate : 0.1,
			color: 'rgba(255,255,0,1)',
			effect : 'arrow',
			sprite : 'img/parchemin_fire_arrow',
			message : 'Unlish the power of the sun !'
		},
		bonus_2 : {
			drop_rate : 0.2,
			color: 'rgba(0,0,255,1)',
			effect : 'explosion',
			sprite : 'img/parchemin_explosion',
			message : 'Burn them all !'
		},
		bonus_3 : {
			drop_rate : 0.4,
			color: 'rgba(0,255,0,1)',
			effect : 'lightning',
			sprite : 'img/parchemin_lightning',
			message : 'Ta-zzzzz-eeeer !'
		}
	},
	DIFFICULTY_COEF : 1, // Coefficient pour calculer les courbes de difficultés
}