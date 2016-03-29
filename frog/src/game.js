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

var OBJECT_PLAYER = 1,
    OBJECT_ENEMY = 2,
    OBJECT_TRUNK = 4,
    OBJECT_HOME = 8;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();
  Game.setBoard(3,new TitleScreen("Frog Game", 
                                  "Press space to start playing",
                                  playGame));
};

var playGame = function() {
	var base = new GameBoard();
  var board = new GameBoard();
  base.add(new fondo());
  var rana = new frog();

  board.add(new home());

  board.add(new CarSpawner(new car('car1',-48, Game.height/2, 70), 3));
  board.add(new CarSpawner(new car('car2',Game.width, Game.height/2+48, -60), 4));
  board.add(new CarSpawner(new car('car3',-96, Game.height/2+(48*2), 60), 4));
  board.add(new CarSpawner(new car('car4',Game.width, Game.height/2+(48*3), -70), 3));

  board.add(new water(rana));

  board.add(new LogSpawner(new log('trunk',-142, Game.height/2-(48*2), 50, rana), 5));
  board.add(new LogSpawner(new log('trunk',Game.width, Game.height/2-(48*3), -55, rana), 4.5));
  board.add(new LogSpawner(new log('trunk',-142, Game.height/2-(48*4), 60, rana), 6));
  board.add(rana);
  Game.setBoard(2,base);
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
                                  "Press space to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press space to play again",
                                  playGame));
};
var water = function(rana){
  this.x =0;
  this.y=48;
  this.w=Game.width; 
  this.h=48*3;
  this.rana = rana;
  this.draw = function(dt){};
};
water.prototype = new Sprite();
water.prototype.type = OBJECT_ENEMY;
water.prototype.step = function(dt){
 
  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    this.hit();
  }
};

water.prototype.hit = function(){
  if(!this.rana.log()){
     this.board.add(new death(this.x + this.w/2, 
                                   this.y + this.h/2));
  }
};

var log = function(sprite,x,y, vel, rana){
  this.setup(sprite, { vx: 0, reloadTime: 0.75});
  this.ranita = rana;
  this.x = x;
  this.y = y;
  this.posInitial = x;
  this.vel = vel;
};
log.prototype = new Sprite();
log.prototype.type = OBJECT_TRUNK;

log.prototype.step = function(dt) {
	this.vx = this.vel;
 	this.x += this.vx * dt;
  if(this.posInitial == 0){
    if(this.x > Game.width) { 
      this.board.remove(this); 
    }
  }
  else if(this.posInitial == Game.width){
    if(this.x < (0-this.w)) { 
      this.board.remove(this);
    }
  }

  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    this.hit();
  }
};
log.prototype.hit = function() {
  this.ranita.unlog(this.vx);
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
    this.x += this.vx * dt;

    if(this.time > 0.100){
      if(Game.keys['left']) { this.x -= this.w; }
      else if(Game.keys['right']) { this.x += this.w; }
       else if(Game.keys['up']) { this.y -= this.h; }
        else if(Game.keys['down']) { this.y += this.h; }
         else { this.vx = 0; this.vy = 0 }
      this.time = 0;
    }

    if(this.x < 0 ) { this.x = 0; }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }
    if(this.y < 0 ) { this.y = 0; }
    else if(this.y > Game.height - this.h) { 
      this.y = Game.height - this.h;
    }
    var collisionTrunk = this.board.collide(this,OBJECT_TRUNK);
    if(collisionTrunk) {
      collisionTrunk.hit();
    }
    else{
      var collision = this.board.collide(this,OBJECT_ENEMY);
      if(collision) {
        this.hit();
        this.board.remove(this);
      }
    }
    this.vx = 0
  };

  frog.prototype.hit = function() {
    if(this.board.remove(this)) {
      this.board.add(new death(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  };

  frog.prototype.unlog = function(vlog){
    this.vx = vlog;
  };

  frog.prototype.log = function(){
     var collisionTrunk = this.board.collide(this,OBJECT_TRUNK);
    return collisionTrunk;
  };

var car = function(sprite,x,y, vel){
  this.setup(sprite, { vx: 0, reloadTime: 0.75});
  this.x = x;
  this.y = y;
  this.posInitial = x;
  this.vel = vel;
};
car.prototype = new Sprite();
car.prototype.type = OBJECT_ENEMY;

car.prototype.step = function(dt) {

  this.vx = this.vel;
 	this.x += this.vx * dt;

  if(this.posInitial == 0){
    if(this.x > Game.width) { 
      this.board.remove(this); 
    }
  }
  else if(this.posInitial == Game.width){
    if(this.x < (0-this.w)) { 
      this.board.remove(this);
    }
  }
};

car.prototype.hit = function() {
 // this.health -= damage;
  //if(this.health <=0) {
  if(this.board.remove(this)){
     this.board.add(new death(this.x + this.w/2, 
                                   this.y + this.h/2));
  }
};

var death = function(centerX,centerY) {
  this.setup('death', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

death.prototype = new Sprite();

death.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 4) {
    this.board.remove(this);
    this.finish();
  }

};

death.prototype.finish = function(){
  loseGame();
};

var home = function(){
  this.x =0;
  this.y=0;
  this.w=Game.width; 
  this.h=48;
  this.draw = function(dt){};
};

home.prototype = new Sprite();
home.prototype.type = OBJECT_HOME;
home.prototype.step = function(dt){
 
  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    winGame();
  }
};

home.prototype.hit = function(){
  if(!this.rana.log()){
     this.board.add(new death(this.x + this.w/2, 
                                   this.y + this.h/2));
  }
};


var Spawner = function (){
  this.time = 0;

};

Spawner.prototype.draw = function(){};
Spawner.prototype.step = function(dt){
  this.time += dt;

  if (this.time >= this.spawnerTime){
    this.time = 0;
    this.board.addInitial(this.getObj());
  }


};


var CarSpawner = function(prototype, time){
  this.spawnerTime = time;

  this.getObj = function(){
    var coche = new car(prototype.sprite,prototype.x, prototype.y, prototype.vel);
    coche.type=prototype.type;
    return coche;

  };

};
CarSpawner.prototype = new Spawner();

var LogSpawner = function(prototype, time){
  this.spawnerTime = time;

  this.getObj = function(){
    var tronco = new log(prototype.sprite,prototype.x, prototype.y, prototype.vel, prototype.ranita);

    tronco.type=prototype.type;
    /*tronco.x = prototype.x;
    tronco.vel = prototype.vel;
    tronco.y = prototype.y;*/

    return tronco;
  };

};

LogSpawner.prototype = new Spawner();

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});


