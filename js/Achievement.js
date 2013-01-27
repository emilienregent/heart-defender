function Achievement()
{
	this.stop = true;
	this.cleared = true;

	// Etat du jeu
	this.waiting = true;
	
	this.backgroundImage;
	this.logo;
	this.achievementBack;
	
	this.achievementIconPos = { x : 100, y : HEIGHT/3 };
	this.achievementTextPos = { x : WIDTH/2, y : HEIGHT / 3 };
	
	this.achievementIcons = [ "img/jewel_ico" ];
	this.achievementTexts = [ "Your first achievement" ];
	
	this.selectedSprite = 0;
	
	this.achievements = new Array();
	
	this.init = function() 
	{
		this.waiting = false;
		this.stop = false;

		this.cleared = false;
		
		this.backgroundImage = { image : IM.getInstance('img/tuto_bg'), pos : { x : 0, y : 0 } };
		this.logo            = { image : IM.getInstance('img/logo'), pos : { x : WIDTH/2, y : 75 } };
		this.achievementBack = { image : IM.getInstance('img/parchemin'), pos : { x : 0, y : 0 } };		
		
		//init achievements 
		var offset = { x : 100, y : HEIGHT/2 + 10 }, step = { x : 200, y : 100 };
		var achievementPerLine = 5;
		for ( var i = 0; i < 10; i++ )
		{
			var grid = { lin : ( i / achievementPerLine ) | 0, col : i % achievementPerLine };

			var achievement =
			{
				image      : IM.getInstance( this.achievementIcons[ 0 ] ),
				text       : this.achievementTexts[0],
				pos        : { x : offset.x + grid.col * step.x, y : offset.y + grid.lin * step.y },
				isUnlocked : true
			}
			
			this.achievements.push( achievement )
		}
	};
	
	this.animate = function()
	{
	//	console.log( "updating" );
	};
	
	this.renderAchievements = function()
	{
		for( var i = 0; i < this.achievements.length; i++ )
		{
			var achievement = this.achievements[i];
			var scale = 1.5;
			 
			//render parchemin first 
			var halfSize = { w : this.achievementBack.image.width/2 * scale, h : this.achievementBack.image.height/2 * scale };
			ctx.drawImage( this.achievementBack.image.data, achievement.pos.x - halfSize.w, achievement.pos.y - halfSize.h, this.achievementBack.image.width * scale, this.achievementBack.image.height * scale );
			
			//render achievement if unlock
			if ( achievement.isUnlocked )
			{
				var halfSize = { w : achievement.image.width/2, h : this.achievementBack.image.height/2 };
				ctx.drawImage( achievement.image.data, achievement.pos.x - halfSize.w, achievement.pos.y - halfSize.h + 5 );
			}
			else
			{
				//dessine unlock icon ici
			}
		}
	}
	
	this.render = function()
	{
		// console.log( "my render" );
		
		ctx.fillStyle = "0000ff";
		ctx.fillRect( 0, 0, WIDTH, HEIGHT );
		
		ctx.drawImage( this.backgroundImage.image.data, this.backgroundImage.pos.x, this.backgroundImage.pos.y );
		ctx.drawImage( this.logo.image.data, this.logo.pos.x - this.logo.image.width/2, this.logo.pos.y );
		
		this.renderAchievements();
		this.renderSelected();
	}
	
	this.update = function()
	{
		this.animate();
		this.render();
		
	}
}