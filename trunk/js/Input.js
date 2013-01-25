/**
 * Input.js
 **/

function Input(options)
{
	if (options)
		this.target = options.target || document;
	else
		this.target = document;
	
	this.mouseEventsSet = false;
	this.keyboardEventsSet = false;

	this.keyboard = {
		up : false,
		right : false,
		down : false,
		left : false,
		space : false
	};

	this.mouse = {
		x : null,
		y : null,
		prevX : null,
		prevY : null,
		down : false,
		up : true,
		click : false // Single click per frame
	};

	this.listen = function() {

		this.listenMouse();
		this.listenKeyboard();

	}

	this.listenMouse = function() {

		if (!this.mouseEventsSet)
			this.setMouseEvents();

	};

	this.listenKeyboard = function() {

		if (!this.keyboardEventsSet)
			this.setKeyboardEvents();

	};

	this.setMouseEvents = function() {

		var that = this;

		this.target.addEventListener('mousemove', function(evt) {
			that.updateMouse(evt);
		}, false);

		this.target.addEventListener('mousedown', function(evt) {
			that.updateMouse(evt);
			that.mouse.down = true;
			that.mouse.up = false;
			that.mouse.click = true;
		}, false);

		this.target.addEventListener('mouseup', function(evt) {
			that.updateMouse(evt);
			that.mouse.up = true;
			that.mouse.down = false;
			that.mouse.click = false;
		}, false);

		this.target.addEventListener('contextmenu', function(evt) {
			evt.preventDefault();
		}, false);

		this.eventsSet = true;

	};

	this.updateMouse = function(evt) {
		
		this.mouse.prevX = this.mouse.x;
		this.mouse.prevY = this.mouse.y;

		this.mouse.x = evt.clientX - this.target.offsetLeft;
		this.mouse.y = evt.clientY - this.target.offsetTop;

	};

	this.setKeyboardEvents = function() {

		var that = this;

		document.addEventListener('keydown', function(evt) {

			that.keyboard.up 	= evt.keyCode == 38 ? 1 : that.keyboard.up;
			that.keyboard.right = evt.keyCode == 39 ? 1 : that.keyboard.right;
			that.keyboard.down 	= evt.keyCode == 40 ? 1 : that.keyboard.down;
			that.keyboard.left 	= evt.keyCode == 37 ? 1 : that.keyboard.left;
			that.keyboard.space = evt.keyCode == 32 ? 1 : that.keyboard.space;

		}, false);

		document.addEventListener('keyup', function(evt) {

			that.keyboard.up 	= evt.keyCode == 38 ? 0 : that.keyboard.up;
			that.keyboard.right = evt.keyCode == 39 ? 0 : that.keyboard.right;
			that.keyboard.down 	= evt.keyCode == 40 ? 0 : that.keyboard.down;
			that.keyboard.left 	= evt.keyCode == 37 ? 0 : that.keyboard.left;
			that.keyboard.space = evt.keyCode == 32 ? 0 : that.keyboard.space;

		}, false);

	};

}