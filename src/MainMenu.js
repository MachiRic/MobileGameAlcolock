Ball.MainMenu = function (game) { };
Ball.MainMenu.prototype = {
	create: function () {
		//background
		this.stage.backgroundColor = "#ffffff";
		this.bgImage = this.add.sprite(0, 0, 'screen-mainmenu');
		this.bgImage.scale.setTo(Ball._WIDTH / this.bgImage.width, Ball._HEIGHT / this.bgImage.height);
		this.bar = this.game.add.graphics();
		this.bar.beginFill(0x000000, 0.8);
		this.bar.drawRect(Ball._WIDTH * 0.05, Ball._HEIGHT * 0.05, Ball._WIDTH * 0.9, Ball._HEIGHT * 0.9);
		this.bar.endFill();
		//title
		this.title = this.add.text(Ball._WIDTH * 0.1, Ball._HEIGHT * 1.0 / 3.0, 'Maze', { font: "200px 3Dpixel", ...Ball.white });
		this.title.anchor.setTo(0, 1);
		this.subTitle = this.add.text(Ball._WIDTH * 0.9, Ball._HEIGHT * (1.0 / 3.0 - 1.0 / 10.0), 'Alcolock', { font: "125px 3Dpixel", ...Ball.white });
		this.subTitle.anchor.setTo(1, 1);
		//game start button
		//graphics
		this.startButton = [];
		this.startButton.push(this.game.add.graphics()); //border
		this.startButton.push(this.game.add.graphics()); //background
		this.startButton.push(this.game.add.text(0, 0, "Start Test", {...Ball.fontBig, ...Ball.white})); //text
		this.startButton[2].anchor.setTo(0.5);
		this.startButton[0].beginFill(0xffffff, 0);
		this.startButton[0].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
		this.startButton[0].endFill();
		this.startButton[1].lineStyle(4, 0xffffff, 1);
		this.startButton[1].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
		//behaviour
		this.startButtonGroup = this.game.add.group();
		this.startButtonGroup.inputEnableChildren = true;
		this.startButtonGroup.addMultiple(this.startButton);
		this.startButtonGroup.x = Ball._WIDTH*0.5;
		this.startButtonGroup.y = Ball._HEIGHT*0.5;
		this.startButtonGroup.onChildInputOver.add(this.onOver, this);
    	this.startButtonGroup.onChildInputOut.add(this.onOut, this);
		this.startButtonGroup.onChildInputDown.add(this.startGame, this);
	},

	startGame: function () {
		//this.game.state.start('Howto');
		this.game.state.start('Game');
	},

	onOver: function() {
		this.startButtonGroup.children[1].tint = 0xe6e6e6;
		this.startButtonGroup.children[2].tint = 0xe6e6e6;
	},

	onOut: function() {
		this.startButtonGroup.children[1].tint = 0xffffff;
		this.startButtonGroup.children[2].tint = 0xffffff;
	}

};