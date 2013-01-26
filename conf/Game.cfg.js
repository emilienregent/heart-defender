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
		LIFE_DISPLAY : '<img src="img/life.png"/>',	/*Balise pour afficher une vie du joueur*/
	}
}