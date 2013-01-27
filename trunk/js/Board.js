/**
 * Board.js
 **/

function Board(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Board - Board parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les messages de la board à afficher..
	this.messages = [];

	this.maxHeight = 61;
	this.boardWidth = 450;

	// Sprites
	this.sprite = IM.getInstance('img/board-bg');

	/**
	 * Fonction qui ajoute un message dans la liste
	 **/
	this.add = function(options) {

		if (this.messages.length == 0) {
			this.messages.push({
				message : options.message,
				interval : options.interval,
				y : (-1 * this.maxHeight),
				x : WIDTH/2 - (450/2),
				speed : 2,
				state : 'down'
			});

			this.lastTime = +new Date();
		}
	};

	/**
	 * Fonction qui s'occupe d'afficher les messages
	 **/
	this.animate = function() {

		for (var i = 0, c = this.messages.length; i < c; i++) {
			var e = this.messages[i];

			if ( e.state == 'down' && e.y < 0 )
				e.y += e.speed;
			else if (e.state == 'up')
				e.y -= e.speed;


			if (e.state == 'down' && interval(this.lastTime,e.interval))
				e.state = 'up';

			if (e.y < (-1 * this.maxHeight) && e.state == 'up') {
				this.messages.splice(i, 1);
				--c;
			}
		}

	};

	/**
	 * Dessin des messages
	 **/
	this.render = function() {

		for (var i = 0, c = this.messages.length; i < c; i++) {
			var e = this.messages[i];

			// ctx.fillStyle = m.color;
			// ctx.font = m.fontSize + 'px SilkscreenNormal';
			IM.drawImage(ctx, this.sprite, e.x, e.y);
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'black';//'#ffaf00';
			ctx.font = '16px lucida_handwritingitalic';
			var w = ctx.measureText(e.message).width;
			var h = ctx.measureText(e.message).height;
			ctx.fillText(e.message, (e.x + this.boardWidth/2) - w/2 , e.y+35);
		}
	};

}