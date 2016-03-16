var sprites = {
  frog: { sx: 0, sy: 0, w: 48, h: 48, frames: 1 },
  bg: { sx: 433, sy: 0, w: 320, h: 480, frames: 1 },
  car1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
  car2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },  
  car3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
  car4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
  car5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
  trunk: { sx: 288, sy: 383, w: 142, h: 48, frames: 1 },
  death: { sx: 0, sy: 143, w: 48, h: 48, frames: 4 }
};

var enemies = {
  car1: {sprite: 'car1'},
  car2: {sprite: 'car2'},
  car3: {sprite: 'car3'},
  car4: {sprite: 'car4'},
  car5: {sprite: 'car5'}
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16,
    OBJECT_TRUNK = 32;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }  
  Game.setBoard(3,new TitleScreen("Alien Invasion", 
                                  "Press fire to start playing",
                                  playGame));
};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 10000,  16000, 400, 'circle' ],
  [ 17800,  20000, 500, 'straight', { x: 50 } ],
  [ 18200,  20000, 500, 'straight', { x: 90 } ],
  [ 18200,  20000, 500, 'straight', { x: 10 } ],
  [ 22000,  25000, 400, 'wiggle', { x: 150 }],
  [ 22000,  25000, 400, 'wiggle', { x: 100 }]
];




var playGame = function() {
  /*
  var board = new GameBoard();
  board.add(new PlayerShip());
  board.add(new Level(level1,winGame));
  Game.setBoard(3,board);
  Game.setBoard(5,new GamePoints(0));*/
  var board = new GameBoard();
  board.add(new fondo());
  var rana = new frog();

  board.add(new car('car1',Game.width, Game.height/2, -1));
  board.add(new car('car2', 0, Game.height/2+48, 1));

  board.add(new log('trunk',0, Game.height/2-(48*2), 0.1, rana))
  board.add(new log('trunk',Game.width, Game.height/2-(48*3), -0.1, rana))
  board.add(new log('trunk',0, Game.height/2-(48*4), 0.1, rana))
  board.add(rana);
  Game.setBoard(3,board);

};

var fondo = function(){
  this.setup('bg', {x:0 , y:0});
  this.w = Game.width;
  this.h = Game.height;
  this.step = function(dt){};
};

fondo.prototype = new Sprite();

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
};

/*var posCars = {Game.height/2, Game.height/2+48, Game.height/2+(48*2), Game.height/2+(48*3)}
var loadCars = function(){
  var pos = Math.floor(Math.random() * (4));
  var car = Math.floor(Math.random() * (4));
  var vel = Math.floor(Math.random() * (1));
    var self = this;
    setInterval(
      function(){
        self.draw();
        self.gs.drawMessage(self.mensaje);
        },16);
}*/

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

var log = function(sprite,x,y, vel, frog){
  this.setup(sprite, { vx: 0, reloadTime: 0.75});
  this.frog = frog;
  this.x = x;
  this.y = y;
  this.posInitial = x;
  this.vel = vel;
};
log.prototype = new Sprite();
log.prototype.type = OBJECT_TRUNK;

log.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

log.prototype.step = function(dt) {
  this.t += dt;

  this.vx += this.vel;//+ this.B * Math.sin(this.C * this.t + this.D);
  //this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.dt = dt;

  if(this.posInitial == 0){
    if(this.x > Game.width) { 
      this.board.remove(this); 
    }
  }
  else if(this.posInitial == Game.width){
    if(this.x < 0) { 
      this.board.remove(this);
    }
  }

  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    this.hit(this.damage);
  }
};
log.prototype.hit = function(damage) {
  this.frog.x += this.vx * this.dt;
};

var frog = function() { 
  this.setup('frog', { vx: 0, reloadTime: 0.25});

  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - this.h;
  this.time = 0;  
};

frog.prototype = new Sprite();
frog.prototype.type = OBJECT_PLAYER;

frog.prototype.step = function(dt) {
    this.time += dt;
    if(this.time > 0.100){
      if(Game.keys['left']) { this.x -= this.w; }
      else if(Game.keys['right']) { this.x += this.w; }
       else if(Game.keys['up']) { this.y -= this.h; }
        else if(Game.keys['down']) { this.y += this.h; }
         else { this.vx = 0; this.vy = 0 }
      this.time = 0;
    }
    

    //this.x += this.vx * dt;

    if(this.x < 0 ) { this.x = 0; }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }
    if(this.y < 0 ) { this.y = 0; }
    else if(this.y > Game.height - this.h) { 
      this.y = Game.height - this.h;
    }
    var collision = this.board.collide(this,OBJECT_ENEMY);
    if(collision) {
      collision.hit(this.damage);
      this.board.remove(this);
    }
    /*this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }*/
  };

frog.prototype.hit = function() {
  if(this.board.remove(this)) {
    loseGame();
  }
};


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }
};


/*var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};
*/
var car = function(sprite,x,y, vel){
  this.setup(sprite, { vx: 0, reloadTime: 0.75});
  this.x = x;
  this.y = y;
  this.posInitial = x;
  this.vel = vel;
};
car.prototype = new Sprite();
car.prototype.type = OBJECT_ENEMY;

car.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

car.prototype.step = function(dt) {
  this.t += dt;

  this.vx += this.vel;//+ this.B * Math.sin(this.C * this.t + this.D);
  //this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;

  if(this.posInitial == 0){
    if(this.x > Game.width) { 
      this.board.remove(this); 
    }
  }
  else if(this.posInitial == Game.width){
    if(this.x < 0) { 
      this.board.remove(this);
    }
  }

  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }
};

car.prototype.hit = function(damage) {
 // this.health -= damage;
  //if(this.health <=0) {
  if(this.board.remove(this)){
    loseGame();
  }
};

var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};
window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});


