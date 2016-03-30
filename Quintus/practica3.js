window.addEventListener("load",function() {
	
	var Q = window.Q = Quintus().include("Sprites, Scenes, Input,UI, 2D, Touch, Anim, TMX")
					.setup({ maximize : true
						//width: 320, // Set the default width to 800 pixels
						//height: 480, // Set the default height to 600 pixels
					})
					.controls(true).touch();

	Q.scene("level1", function(stage){
		Q.stageTMX("level.tmx",stage);
		stage.add("viewport").centerOn(window.width, window.height);

	});

	Q.loadTMX("level.tmx", function(){
		Q.stageScene("level1");


	});

});
