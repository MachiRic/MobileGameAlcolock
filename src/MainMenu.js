Ball.MainMenu = function(game) {};
Ball.MainMenu.prototype = {
	create: function() {
		//background
		this.stage.backgroundColor = "#ffffff";
		this.bgImage = this.add.sprite(0, 0, 'screen-mainmenu');
		this.bgImage.scale.setTo(Ball._WIDTH/this.bgImage.width, Ball._HEIGHT/this.bgImage.height);
		this.bar = this.game.add.graphics();
		this.bar.beginFill(0x000000, 0.8);
		this.bar.drawRect(Ball._WIDTH*0.05, Ball._HEIGHT*0.05, Ball._WIDTH*0.9, Ball._HEIGHT*0.9);
		//title
		this.title = this.add.text(Ball._WIDTH*0.1, Ball._HEIGHT*1.0/3.0, 'Maze', { font: "200px 3Dpixel", ...Ball.white});
		this.title.anchor.setTo(0, 1);
		this.subTitle = this.add.text(Ball._WIDTH*0.9, Ball._HEIGHT*(1.0/3.0-1.0/10.0), 'Alcolock', { font: "125px 3Dpixel", ...Ball.white});
        this.subTitle.anchor.setTo(1, 1);
		//this.gameTitle = this.add.sprite(Ball._WIDTH*0.5, 40, 'title');
		//this.gameTitle.anchor.set(0.5,0);
		this.startButton = this.add.button(Ball._WIDTH*0.5, Ball._HEIGHT*0.5, 'button-start', this.startGame, this, 2, 0, 1);
		this.startButton.anchor.set(0.5);
		this.startButton.input.useHandCursor = true;

		// button to "read the article"
	},
	startGame: function() {
		//this.game.state.start('Howto');
		this.game.state.start('Game');
	}
};