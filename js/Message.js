/**
 * Message.js
 **/

function Message(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Message - Message parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les messages à afficher..
	this.messages = [];

	/**
	 * Fonction qui ajoute un message dans la liste
	 **/
	this.add = function(options) {

		this.messages.push({
			message : options.message,
			x : options.x,
			y : options.y,
			speed : options.speed,
			decrementOpacity : options.decrementOpacity,
			fontSize : options.fontSize,
			color : options.color,
			opacity : .75
		});

	};

	/**
	 * Fonction qui s'occupe d'afficher les messages
	 **/
	this.animate = function() {

		for (var i = 0, c = this.messages.length; i < c; i++) {
			var m = this.messages[i];

			m.y -= m.speed;
			m.opacity -= m.decrementOpacity;

			if (m.opacity <= 0) {
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
			var m = this.messages[i];

			ctx.fillStyle = m.color;
			ctx.font = m.fontSize + 'px SilkscreenNormal';
			ctx.globalAlpha = m.opacity;
			ctx.fillText(m.message, m.x, m.y);
			ctx.globalAlpha = 1;
		}
	};

}