/**
 * Game.js
 **/

function Game()
{
	
	/**
	 * Properties
	**/

	/**
	 * Initialization
	 **/

	this.init = function() 
	{

		console.log( "Coucou" );

	};
	
	/**
	 * Animation Methods
	 **/
	
	this.animate = function() {

		

	};

	/**
	 * Drawing Methods
	 **/

	this.render = function() {

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

	};

	/**
	 * LOOP update
	 **/

	this.update = function() {

		this.animate();
		this.render();

	};
}