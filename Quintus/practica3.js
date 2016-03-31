window.addEventListener("load",function() {
	
	var Q = window.Q = Quintus().include("Sprites, Scenes, Input,UI, 2D, Touch, Anim, TMX")
					.setup({ //maximize : true
						width: 320, // Set the default width to 800 pixels
						height: 480, // Set the default height to 600 pixels
					})
					.controls().touch();

	Q.scene("level1", function(stage){
		Q.stageTMX("level2.tmx",stage);
		
		var player = stage.insert(new Q.Mario());
		stage.insert(new Q.Goomba());
		//stage.insert(new Q.Bloopa());
		stage.insert(new Q.Princess());
		// Give the stage a moveable viewport and tell it
		// to follow the player.
		stage.add("viewport").follow(player);
		stage.viewport.offsetX = -10;
		stage.viewport.offsetY = 155;
		

	});

	Q.scene('endGame',function(stage) {
	  var box = stage.insert(new Q.UI.Container({
	    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	  }));
	  
	  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
	                                           label: "Play Again" }))         
	  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
	                                        label: stage.options.label }));
	  button.on("click",function() {
	    Q.clearStages();
	    Q.stageScene("startGame", { label: "Start Game"});
	  });

	 
	  box.fit(20);

	});

	Q.scene('startGame',function(stage) {
	  var box = stage.insert(new Q.UI.Container({
	    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	  }));
	  
	  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
	                                           label: "Play" }))         
	  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, fill: "#CCCCCC",
	                                        label: stage.options.label }));
	  button.on("click",function() {
	    Q.clearStages();
	    Q.stageScene('level1');
	  });

	  Q.input.on("confirm",this,function(){
	  	Q.clearStages();
	    Q.stageScene('level1');
	  });


	});

	Q.loadTMX("level2.tmx, mario_small.png, mario_small.json,goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png, tiles.png", function(){

		//Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
		Q.sheet("mario","mario_small.png", { "tilew": 32, "tileh": 32,"sx": 0,"sy": 0}); 
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("mario_small.png","mario_small.json");

		Q.sheet("goomba","goomba.png", { "tilew": 32, "tileh": 32,"sx": 0,"sy": 0}); 
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("goomba.png","goomba.json");

		Q.sheet("bloopa","bloopa.png", { "tilew": 32, "tileh": 32,"sx": 0,"sy": 0}); 
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("bloopa.png","bloopa.json");


		Q.stageScene("startGame", { label: "Start Game"});


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
			this.add('2d, platformerControls, animation');

			this.on("win_game","winGame");
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
				if(this.p.y > 600){
					Q.stageScene("level1");
				}
		},

		winGame: function(){
			Q.stageScene("endGame",1, { label: "You Win" });
		}
	});

	Q.Sprite.extend("Goomba",{
		init: function(p){
			this._super(p,{
				sprite:"goomba",
				sheet: "goomba",
				x: 15*32,
				y: 14*32,
				vx: 100 
			});

			this.add('2d, aiBounce, animation');

			this.on("bump.left,bump.right",function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.stageScene("endGame",1, { label: "You Died" });
					collision.obj.destroy();
					//Q.stageScene("level1");
				}
			});

			this.on("bump.top",function(collision) {
				if(collision.obj.isA("Mario")) {
					this.destroy();
					//collision.obj.p.vy = -300; //se utiliza para que salte cuando muere
				}
			});
		}
	});


	Q.Sprite.extend("Bloopa",{
		init: function(p){
			this._super(p,{
				sprite:"bloopa",
				sheet: "bloopa",
				x: 200,
				y: 14*32,
				vy: -150
			});
			this.time = 0;
			this.add('2d, animation');

			this.on("bump.left,bump.right, bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.stageScene("endGame",1, { label: "You Died" });
					collision.obj.destroy();
					//Q.stageScene("level1");
				}
			});

			this.on("bump.top",function(collision) {
				if(collision.obj.isA("Mario")) {
					this.destroy();
					collision.obj.p.vy = -300;
				}
			});
		},

		step: function(dt) {
			this.time += dt;
			this.p.y += this.p.vy * dt;
			if(this.p.vy == 0 && this.time >= 0.50){
				this.p.vy = -150;
				this.time = 0;
			}
		}
	});


	Q.Sprite.extend("Princess",{
		init: function(p){
			this._super(p,{
				asset: "princess.png",
				x: 220,
				y: 14*32,
				collision: false
			});

			this.add('2d, animation, tween');
			console.log("princess");
			this.on("hit.sprite",this,"hit");

		},

		hit: function(col) {
			// Win the game
			if(col.obj.isA("Mario") && !this.p.collision) {
				this.p.collision = true;
				col.obj.trigger('win_game');
			}
		}

	});

	

});
