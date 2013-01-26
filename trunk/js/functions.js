/**
 * Functions.js
 **/

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback, elements) {
					window.setTimeout(callback, 1000/40);
				}
	})();
}

// console.log shortcut
function log(message) {
	return console.log(message);
}

// console.warn shortcut
function warn(message) {
	return console.warn(message);
}

// querySelectorAll shortcut
function $$(selector) {
	var qsa = document.querySelectorAll(selector);
	return (qsa.length === 1 ? qsa[0] : qsa);
}

// Print something in the HTML
function debug(message) {
	var debug = document.querySelector('#debug');
	if (!debug) {
		debug = document.createElement('div');
		debug.setAttribute('id', 'debug');
		document.body.appendChild( debug );
	}

	debug.innerText = message;
}

// Compute a random value between 'a' and 'b'
function rand(a, b) {
	return a + Math.random() * (b - a);
}

// Détermine la distance entre 2 points
function distance(a, b, x, y){
	var distance = Math.sqrt((a-x)*(a-x) + (b-y)*(b-y));
	return distance;
}

// Detect collision between two objects 'a' and 'b'
// Assuming both 'a' and 'b' have x/y/w/h properties
function collide(a, b) {
	return !(b.x >= a.x + a.w // Trop à droite
			|| b.x + b.w <= a.x // Trop à gauche
			|| b.y >= a.y + a.h // Trop en bas
			|| b.y + b.h <= a.y) // Trop en haut
}

// Pickup a random value into an Array
Array.prototype.pickup = Array.prototype.pickup || function() {
	return this[ Math.floor(Math.random()*this.length) ];
}

// Teste si un interval est passé
function interval(time, interval) {
	return Math.abs(time - new Date().getTime()) / 1000 > interval;
}
