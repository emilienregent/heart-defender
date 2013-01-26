function Loader( canvasSize, path, ctx, callback )
{
	this.canvas        = document.createElement( 'canvas' );
	this.canvas.width  = canvasSize.w; 
	this.canvas.height = canvasSize.h; 
	
	this.context = ctx;
	
	this.path   = path;
	
	this.cachedImages = new Array();
	this.cachedSounds = new Array();
	
	this.totalImages  = 0;
	this.loadedImages = 0;
	
	this.totalSounds  = 0;
	this.loadedSounds = 0;
	
	this.loadCircle = 0;
	
	this.frameCount   = 30;
	this.currentFrame = 0;
	
	this.isUpdateAudio = false;
	this.isSkipImages  = true;
	
	this.imageDirectories = [ { name : "", files : [ "" ] } ];
	
	this.soundDirectories = [ { name : "", files : [ "heart_fast.ogg", "heart_slow.ogg", "game.ogg", "theme.ogg", "title.ogg", 
	                                                 "heart_slow2.ogg", "heart_fast2.ogg", "heart_fast3.ogg", "heart_shock.ogg",
													 "powerup.ogg", "destroy.ogg", "damage.ogg" ] } ];
			
	this.callbackFunc = callback;
	
	this.cacheData();						 
}

Loader.prototype.constructor = Loader;

Loader.prototype.cacheData = function()
{
	var thisObj = this;
	if ( !this.isSkipImages )
	{
		for ( var i = 0; i < this.imageDirectories.length; i++ )
		{
			for ( var j = 0; j < this.imageDirectories[i].files.length; j++ )
			{	
				this.totalImages++;
				
				var image  = new Image();
				var imPath = this.path.img + this.imageDirectories[i].name + this.imageDirectories[i].files[j],
					imName = imPath.substring( imPath.lastIndexOf( '/' ) + 1, imPath.lastIndexOf( '.' ) );
				
				image.src  = imPath;
				image.name = imName;
				 
				var imLoadFunc = function(){ thisObj.loadedImages++; };
				if ( image.onloadeddata != undefined ) 
					image.onloadeddata = imLoadFunc;
				else
					image.onload = imLoadFunc;
				
				this.cachedImages[ imName ] = image;
			}
		}
	}
	
	for ( i = 0; i < this.soundDirectories.length; i++ )
	{
		for ( j = 0; j < this.soundDirectories[i].files.length; j++ )
		{
			this.totalSounds++;
			
			var soundClip = new Audio();
			var soundPath = this.path.sound + this.soundDirectories[i].name + this.soundDirectories[i].files[j],
				soundName = soundPath.substring( soundPath.lastIndexOf( '/' ) + 1, soundPath.lastIndexOf( '.' ) );
				
			soundClip.src      = soundPath;
			soundClip.isLoaded = false;
			
			var soundLoadFunc = function()
			{ 
				thisObj.loadedSounds++;
			};
			
			if ( soundClip.onloadeddata != undefined )
				soundClip.onloadeddata = soundLoadFunc;
			else
				if ( !this.isUpdateAudio )
					this.isUpdateAudio = true;
			
			this.cachedSounds[ soundName ] = soundClip;
		}
	}
}

Loader.prototype.isFinished = function()
{
	if ( ( this.isSkipImages || this.loadedImages == this.totalImages ) && 
	       this.loadedSounds == this.totalSounds && isLoadedImages ) 
		return true;
		
	return false;
}

Loader.prototype.loading = function()
{
	//check load audio files 
	if ( this.isUpdateAudio )
	{
		for ( var i = 0; i < this.soundDirectories.length; i++ )
			for ( var j = 0; j < this.soundDirectories[i].files.length; j++ )
			{
				var soundName = this.soundDirectories[i].files[j].substring( 0, this.soundDirectories[i].files[j].lastIndexOf( '.' ) );
				if ( !this.cachedSounds[ soundName ].isLoaded && this.cachedSounds[ soundName ].readyState == 4 )
					this.cachedSounds[ soundName ].isLoaded = true;
					
			//	console.log( this.cachedSounds[ soundName ].readyState );	
			}
			
		this.loadedSounds = 0;
		for ( i = 0; i < this.soundDirectories.length; i++ )
			for ( j = 0; j < this.soundDirectories[i].files.length; j++ )
			{
				var soundName = this.soundDirectories[i].files[j].substring( 0, this.soundDirectories[i].files[j].lastIndexOf( '.' ) );
				if ( this.cachedSounds[ soundName ].isLoaded )
					this.loadedSounds++;
			}
	}
	
	var context = this.canvas.getContext( "2d" );
	var width   = this.canvas.width,
		height  = this.canvas.height;
			
	var textY = .4 * height;
	var lingrad = context.createLinearGradient( 0, 0, 0, height );

	lingrad.addColorStop(0, '#157493');
	lingrad.addColorStop(1, '#64b6cb');

	// assign gradients to fill and stroke styles
	context.fillStyle = lingrad;
	// draw shapes
	context.fillRect( 0, 0, width, height );
	  	
	context.fillStyle = "#072447";
	context.font = "40px Arial";
	context.textAlign = "center";
	  	
	context.fillText( "Loading Assets", width/2, textY );
	context.fillText( "Please Wait", width/2, textY + 50 ); 
		
	context.font = "60px Arial";
	for ( var i = 0; i < this.loadCircle; i++ )
		context.fillText( ".", (width/2 + 150) + i * 10, textY + 50 );
		
	if ( this.currentFrame == 0 )
		this.loadCircle = ( this.loadCircle + 1 ) % 4;
		
	this.currentFrame = ( this.currentFrame + 1 ) % this.frameCount;
	
}

Loader.prototype.loadAssets = function()
{
	if ( !soundLoader.isFinished() )
	{
		soundLoader.loading();
	//	canvasHandler.swapCanvasBuffer( imageLoader.canvas );
		
		soundLoader.context.drawImage( soundLoader.canvas, 0, 0 );	
		setTimeout( soundLoader.loadAssets, 30 );
	}
	else
		soundLoader.callbackFunc();
}