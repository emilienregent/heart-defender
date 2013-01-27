/**
 * Score.js
 **/

function Score(parentObj)
{

	if(!(parentObj instanceof Game)) {
		warn("Construct Score - Score parent isn't instance of Game");
		return null;
	}

	this.parentObj = parentObj;
	// Tableau qui contient tous les scores à afficher..
	this.scores = [];

	// Sprites
	this.sprites = {
		background : IM.getInstance('img/scoring-bg')
	};

	/**
	 * Fonction qui ajoute un score dans la liste
	 **/
	this.add = function(options) {

		this.scores.push({
			score : this.toScore(options.score),
			x : options.x,
			y : options.y,
			speed : options.speed,
			decrementOpacity : options.decrementOpacity,
			opacity : 1
		});

	};

	/**
	 * Fonction qui s'occupe d'afficher les scores
	 **/
	this.animate = function() {

		for (var i = 0, c = this.scores.length; i < c; i++) {
			var e = this.scores[i];

			e.y -= e.speed;
			e.opacity -= e.decrementOpacity;

			if (e.opacity <= 0) {
				this.scores.splice(i, 1);
				--c;
			}
		}

	};

	/**
	 * Dessin des scores
	 **/
	this.render = function() {

		for (var i = 0, c = this.scores.length; i < c; i++) {
			var e = this.scores[i];

			// ctx.fillStyle = m.color;
			// ctx.font = m.fontSize + 'px SilkscreenNormal';
			ctx.globalAlpha = e.opacity;
			IM.drawImage(ctx, this.sprites.background, e.x, e.y);
			switch (e.score.length) {
				case 3 : 	var offset = [6, -4, -14];
							break;

				case 2 : 	var offset = [0, -10];
							break;

				case 1 : 	var	offset = [-5];
							break;

				default : 	var offset = [];
			}

			for (var s = 0; s < e.score.length; s++) {
				var x = e.x + 34 + offset[s];
				var y = e.y + 29 - 4;
				IM.drawImage(ctx, e.score[s], x, y);
			}
			ctx.globalAlpha = 1;
		}
	};

	/**
	 * Convertion d'un nombre en entité Score (sprites)
	 **/
	this.toScore = function(score) {
		var s = score+'';
		var result = [];

		for (var i = 0; i < s.length; i++) {
			var c = s[i];
			result.push( IM.getInstance('img/numbers') );
			result[i].animation = new IIG.Animation(ScoreConf.numbers[c].animation);
		}

		result.reverse();

		return result;
	}

}