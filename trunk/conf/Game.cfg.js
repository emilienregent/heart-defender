/**
 * Game.cfg.js
 **/

var GameConf = 
{
	arena : {
		SPAWN_PADDING : 50,	/*Coefficient pour décaler le point de spawn des murs*/	
		SPAWN_TIME : 3,		/*Délai de génération des éléments de l'arène*/
		MAX_ENEMY : 10,		/*Nombre maximum d'ennemis*/
	},
	player : {
		LIFE : 3,			/*Points de vie du joueur en début de partie*/
		LIFE_DISPLAY : '<img src="img/life.png"/>'	/*Balise pour afficher une vie du joueur*/
	},
	enemy : {
		bob : {
			SCORE_BASE : 10
		}
	},
	menu : {
		/*Bloc HTML de gameover*/
		GAMEOVER_DISPLAY : '<h2>Game Over</h2>'+
							'<h3>Darkness overkill you !</h3>'+
							'<p>Your score is %SCORE%.</p>'+
							'<button onclick="restartGame()">Try to defeat darkness ... again</button>',
		RADIUS : 225	/*Taille du cercle de lumière*/
	},
	heart : {
		SPAWN_TIME : 10, /*Délai de génération du bonus*/
		MAX : 1, /*Nombre maximum de bonus*/
		WIDTH : 26, /*Largeur du bonus*/
		HEIGHT : 26, /*Hauteur du bonus*/
		HEALTH : 10, /*Santé du bonus*/
		LIFE_TIME : 10 /*Durée de vie du bonus*/
	}
}