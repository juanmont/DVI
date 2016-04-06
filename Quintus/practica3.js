window.addEventListener("load",function() {
	
	var Q = window.Q = Quintus().include("Sprites, Scenes, Input,UI, 2D, Touch, Anim, TMX")
					.setup({ //maximize : true
						width: 500, // Set the default width to 800 pixels
						height: 600, // Set the default height to 600 pixels
					})
					.controls().touch();

	Q.scene("level1", function(stage){
		Q.stageTMX("level2.tmx",stage);
		
		var player = stage.insert(new Q.Mario());
		stage.insert(new Q.Goomba({x: 15*32,y: 510,}));
		stage.insert(new Q.Bloopa({x: 200,y: 510,}));
		stage.insert(new Q.Princess());
		var inc = 0;
		for(i = 0; i <=10; i++){
			inc +=30;
			if(i%2==0){
				stage.insert(new Q.Coin({x: 420+inc, y: 470}));
			}
			else
				stage.insert(new Q.Coin({x: 420+inc, y: 490}));
		}
		stage.insert(new Q.Score());
		// Give the stage a moveable viewport and tell it
		// to follow the player.
		stage.add("viewport").follow(player);
		stage.viewport.offsetX = -10;
		stage.viewport.offsetY = 200;
		Q.state.reset({ score: 0});
		

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
	  
	  var button = box.insert(new Q.UI.Button({ asset: "mainTitle.png"}))         
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

	Q.loadTMX("level2.tmx, mario_small.png, mario_small.json,goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png, coin.png, coin.json, mainTitle.png", function(){
		Q.sheet("mario","mario_small.png", { "tilew": 32, "tileh": 32,"sx": 0,"sy": 0}); 
		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png","goomba.json");
		Q.compileSheets("bloopa.png","bloopa.json");
		Q.compileSheets("coin.png","coin.json");

		Q.stageScene("startGame", { label: "Start Game"});
	});

	Q.animations('mario', {
		marioR: { frames: [2,3,4], rate: 1/5},
		marioL: { frames: [16,17,18], rate: 1/5},
		marioDie: { frames: [12], rate: 1/2,loop:false, trigger: "destroy_mario"},
		marioJump: { frames: [20,21,21]},
		marioStand_right: {frames: [0],rate: 1/5},
		marioStand_left: {frames: [14],rate: 1/5}
	});

	Q.animations('bloopa',{
		move: { frames: [1], rate: 1/5},
		die: {frames: [2], rate: 1/5,loop:false, trigger: "delete_bloopa"}
	});

	Q.animations('goomba',{
		move: {frames: [1], rate: 1/5},
		die: {frames: [2], rate: 1/5,loop: false, trigger: "delete_goomba"}
	});

	Q.animations('coin',{
		coin_move: {frames: [0,1,2], rate: 1/2}
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
			this.on("destroy_mario",this,"destroyMario");
		},

		destroyMario: function(){
			this.destroy();
		},

		step: function(dt) {
			if(this.p.animation != "marioDie"){
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
				vx: 100, 
				frame: 0
			});

			this.add('2d, aiBounce, animation, defaultEnemy');
			this.on("delete_goomba","deleteGoomba");
		},

		deleteGoomba: function(){
			this.destroy();
		}
	});


	Q.Sprite.extend("Bloopa",{
		init: function(p){
			this._super(p,{
				sprite:"bloopa",
				sheet: "bloopa",
				vy: -150,
				frame: 0
			});
			this.time = 0;
			this.add('2d, animation, defaultEnemy');
		this.on("delete_bloopa","deleteBloopa");
		},

		deleteBloopa: function(){
			this.destroy();
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
				x: 95*32,
				y: 180,
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


	Q.Sprite.extend("Coin",{
		init: function(p){
			this._super(p,{
				sprite: "coin",
				sheet: "coin",
				gravity: 0
			});

			this.add('2d, animation, tween');
			this.on("destroy_coin", this, "destoyCoin");
			this.on("bump.left, bump.bottom, bump.right, bottom.top",function(collision) {
				if(collision.obj.isA("Mario")) {
					this.animate({ x: this.p.x, y: this.p.y-100}, 0.2, Q.Easing.Linear, {delay:0, callback:this.destroyCoin});
				}
			});

			this.play("coin_move");
		},

		destroyCoin: function(){
			Q.state.inc("score",1); 
			this.destroy();
		}


	});

	Q.UI.Text.extend("Score",{
		init: function(p) {
			this._super({
			label: "score: 0",
			x: 50,
			y: 200
			});
			Q.state.on("change.score",this,"score");
		},
		step: function(){
			this.p.label = "score: " + Q.state.get("score");
		}
	});


	Q.component("defaultEnemy", {
		added: function() {


		var self = this;

		this.entity.on("bump.top", function(collision){
			if(collision.obj.isA("Mario")){
				self.entity.play('die');
			}
		});


		this.entity.on("bump.left,bump.right, bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.stageScene("endGame",1, { label: "You Died" });
					collision.obj.play("marioDie");
					//Q.stageScene("level1");
				}
		});

	} //added

});

	

});
