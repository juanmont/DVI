/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
	this.gs = gs;
	this.arrayPosibilidades = new Array("8-ball","potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin",
										"8-ball","potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin");
		
};

MemoryGame.prototype = {

	initGame: function(){
		
		this.numCartasEncontradas = 0;
		this.mensaje = "Memory Game";
		this.comparaCartas = false;
		this.idUltimaCarta;
		this.click = true;
		this.time = 0;
		this.arrayCartas = new Array();
		this.arrayPosibilidades = this.mezclar(this.arrayPosibilidades);
		for(var i = 0; i < 16; i++){
			
			this.arrayCartas[i] = new MemoryGame.Card(this.arrayPosibilidades[i]);		
		}
		this.gs.drawMessage(this.mensaje);
		this.loop();
	},

	mezclar: function shuffleArray(array){

    for (var i = array.length - 1; i > 0; i--){

          var j = Math.floor(Math.random() * (i+1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }

   return array;

   },

	draw: function(){
		for(var i = 0; i < 16 ; i++)
			this.arrayCartas[i].draw(gs, i);
		

	},


	loop: function(){
		var self = this;
		setInterval(
			function(){
				self.draw();
				self.gs.drawMessage(self.mensaje);
				},16);
	},

	
	onClick: function(cardId){
		if(this.click && cardId != null && cardId >= 0){
			if(this.numCartasEncontradas < 16){
				if(this.arrayCartas[cardId].estado == false){
					this.arrayCartas[cardId].flip();
					this.comparaCartas = !this.comparaCartas;
					if(this.comparaCartas){
						this.idUltimaCarta = cardId;
					}
					else{
						if(!this.arrayCartas[cardId].compareTo(this.arrayCartas[this.idUltimaCarta])){
							this.mensaje = "Try again";
							this.click = false;
							var self = this;
							setTimeout(function(){  self.arrayCartas[cardId].flip();
													self.arrayCartas[self.idUltimaCarta].flip(); 
													self.click = true;}
													, 500);
							
						}
						else{
							this.mensaje = "Match found!!";
							this.arrayCartas[cardId].found();
							this.arrayCartas[this.idUltimaCarta].found();
							this.numCartasEncontradas += 2;
						}
					}
				}
			}
			if(this.numCartasEncontradas == 16)
				this.mensaje = "You win!!";
		}
	}

}


/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGame.Card = function(id) {
	this.estado = false;
	this.id = id;
};

MemoryGame.Card.prototype = {
	draw: function(gs, pos){
		if(!this.estado)
			gs.draw("back",pos);
		else
			gs.draw(this.id,pos);
	},

	found: function(){
		this.estado = true;
	},

	flip: function(){
		this.estado = !this.estado;
	},

	compareTo: function(otherCard){
		if(otherCard.id == this.id)
			return true;
		return false;
	}
}

