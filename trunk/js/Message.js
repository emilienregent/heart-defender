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

		var c = options.callback === undefined ? function() {} : options.callback;

		this.messages.push({
			message : options.message,
			x : options.x || false,
			y : options.y || false,
			speed : options.speed || 1,
			decrementOpacity : options.decrementOpacity || false,
			fontSize : options.fontSize || false,
			color : options.color || false,
			opacity : 1,
			direction : options.direction || false,
			callback : c,
			blur : options.blur || false
		});

	};

	/**
	 * Fonction qui s'occupe d'afficher les messages
	 **/
	this.animate = function() {

		for (var i = 0, c = this.messages.length; i < c; i++) {
			var m = this.messages[i];

			if (m.direction == 'down')
				m.y += m.speed;
			else
				m.y -= m.speed;

			m.opacity -= m.decrementOpacity;

			if (m.opacity <= 0) {
				m.callback();
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
			ctx.font = m.fontSize + 'px lucida_handwritingitalic';
			ctx.globalAlpha = m.opacity;
			if (m.blur && m.color) {
				ctx.shadowBlur = m.blur;
				ctx.shadowColor = m.color;
			}
			var size = ctx.measureText(m.message).width;
			ctx.fillText(m.message, m.x - size/2, m.y);
			ctx.globalAlpha = 1;
			ctx.shadowBlur = 0;
		}
	};

}