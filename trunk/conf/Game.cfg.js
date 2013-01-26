/**
 * Game.cfg.js
 **/

var GameConf = 
{
	arena : {
		SPAWN_PADDING : 50,	/*Coefficient pour décaler le point de spawn des murs*/	
		SPAWN_TIME : 2,		/*Délai de génération des éléments de l'arène*/
		MAX_ENEMY : 20,		/*Nombre maximum d'ennemis*/
	},
	player : {
		LIFE : 3,			/*Points de vie du joueur en début de partie*/
		LIFE_DISPLAY : '<img src="img/jewel_ico.png"/>',	/*Balise pour afficher une vie du joueur*/
		RADIUS : 132.5		/*Rayon du cercle de lumière*/
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
							'<h3>Darkness overkill you !</h3>'+
							'<p>Your score is %SCORE%.</p>'+
							'<button onclick="restartGame()">Try to defeat darkness ... again</button>'
	},
	heart : {
		SPAWN_TIME : 2, /*Délai de génération du bonus*/
		MAX : 1, /*Nombre maximum de bonus*/
		WIDTH : 28, /*Largeur du bonus*/
		HEIGHT : 28, /*Hauteur du bonus*/
		HEALTH : 10, /*Santé du bonus*/
		LIFE_TIME : 20 /*Durée de vie du bonus*/
	},
	bonus : {
		bonus_1 : {
			drop_rate : 0.1,
			color: 'rgba(0,255,255,1)',
			effect : 'Boule de feu'
		},
		bonus_2 : {
			drop_rate : 0.1,
			color: 'rgba(0,0,255,1)',
			effect : 'Flèche'
		},
		bonus_3 : {
			drop_rate : 0.2,
			color: 'rgba(0,255,0,1)',
			effect : 'Rayon ultra violet'
		},
		bonus_4 : {
			drop_rate : 0.3,
			color: 'rgba(255,255,0,1)',
			effect : 'Bombe nucléoïdale'
		}
	}
}