window.addEventListener("load",function() {
	
	var Q = window.Q = Quintus().include("Sprites, Scenes, Input,UI, 2D, Touch, Anim, TMX")
					.setup({ //maximize : true
						width: 320, // Set the default width to 800 pixels
						height: 480, // Set the default height to 600 pixels
					})
					.controls();//.touch();

	Q.scene("level1", function(stage){
		Q.stageTMX("level.tmx",stage);
		//stage.add("viewport").centerOn(150, 380);
		// Create the player and add them to the stage
		var player = stage.insert(new Q.Mario());
		// Give the stage a moveable viewport and tell it
		// to follow the player.
		stage.add("viewport").follow(player);
		stage.viewport.offsetX = -10;
		stage.viewport.offsetY = 155;
		

	});

	Q.loadTMX("level.tmx, mario_small.png, mario_small.json, tiles.png", function(){

		//Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
		Q.sheet("mario","mario_small.png", { "tilew": 32, "tileh": 32,"sx": 0,"sy": 0}); 
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("mario_small.png","mario_small.json");

		Q.stageScene("level1");


	});

	Q.animations('mario', {
		marioR: { frames: [2,3,4], rate: 1/5},
		marioL: { frames: [16,17,18], rate: 1/5},
		marioDie: { frames: [9,10,10]},
		marioJump: { frames: [20,21,21]},
		marioStand_right: {frames: [0],rate: 1/5},
		marioStand_left: {frames: [14],rate: 1/5}
	});


	Q.Sprite.extend("Mario",{
	// the init constructor is called on creation
		init: function(p) {
		// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sprite: "mario",
				sheet: "mario", // Setting a sprite sheet sets sprite width and height
				x: 150, // You can also set additional properties that can
				y: 380, // be overridden on object creation
				frame: 0
			});
			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			// The `platformerControls` makes the player controllable by the
			// default input actions (left, right to move, up or action to jump)
			// It also checks to make sure the player is on a horizontal surface before
			// letting them jump.
			this.add('2d, platformerControls, animation');

			Q.input.on("fire");
			// Wait until the firing animation has played until
			// actually launching the bullet
			// Write event handlers to respond hook into behaviors.
			// hit.sprite is called everytime the player collides with a sprite
			/*this.on("hit.sprite",function(collision) {
			// Check the collision, if it's the Tower, you win!
				if() {
					Q.stageScene("endGame",1, { label: "You Lose!" });
					this.destroy();
				}
			})*/
		},

		step: function(dt) {
				if(this.p.vx > 0) {
					this.play('marioR');
				} else if(this.p.vx < 0) {
					this.play('marioL');
				} else {
					if(this.p.direction == "right")
						this.play("marioStand_right"); 
					else
						this.play("marioStand_left");
				}
		}
	});


});
