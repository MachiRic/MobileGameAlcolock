Ball.Howto = function (game) {
};
Ball.Howto.prototype = {
    create: function() {
        //background
		this.stage.backgroundColor = "#ffffff";
		this.bgImage = this.add.sprite(0, 0, 'screen-mainmenu');
		this.bgImage.scale.setTo(Ball._WIDTH / this.bgImage.width, Ball._HEIGHT / this.bgImage.height);
		this.bar = this.game.add.graphics();
		this.bar.beginFill(0x000000, 0.8);
		this.bar.drawRect(Ball._WIDTH * 0.05, Ball._HEIGHT * 0.05, Ball._WIDTH * 0.9, Ball._HEIGHT * 0.9);
		this.bar.endFill();
		//border
		this.border = this.game.add.graphics();
		this.border.lineStyle(8, 0x000000, 0.8);
        this.border.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT);
        //text
        var text = "You only have 1 chance to do the test.\n\nWhile you could have up to 3 chances if something interrupts you or prevents you from finishing the game.\n\nAfter finish the test, please fill the survey from the result page.\n\nThank you very much for your participation!"
        this.infoText = this.game.add.text(Ball._WIDTH * 0.08,Ball._HEIGHT * 0.08,text,{font: Ball.scaleFactor*26+"px joystix", ...Ball.white});
        //this.infoText.scale.setTo(Ball.scaleFactor);
        this.infoText.wordWrap = true;
        this.infoText.wordWrapWidth = 0.84*Ball._WIDTH;
        //this.infoText.lineSpacing = -20;

        //continue
        this.continueButton = [];
		this.continueButton.push(this.game.add.graphics()); //border
		this.continueButton.push(this.game.add.graphics()); //background
		this.continueButton.push(this.game.add.text(0, 0, "Next", {...Ball.fontBig, ...Ball.white})); //text
		this.continueButton[2].anchor.setTo(0.5);
		this.continueButton[2].scale.setTo(Ball.scaleFactor);
		this.continueButton[0].beginFill(0xffffff, 0);
		this.continueButton[0].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
		this.continueButton[0].endFill();
		this.continueButton[1].lineStyle(4, 0xffffff, 1);
		this.continueButton[1].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
		//behaviour
		this.continueButtonGroup = this.game.add.group();
		this.continueButtonGroup.inputEnableChildren = true;
		this.continueButtonGroup.addMultiple(this.continueButton);
		this.continueButtonGroup.x = Ball._WIDTH*0.5;
        this.continueButtonGroup.y = this.infoText.height+Ball._HEIGHT*(0.08+0.08);
		this.continueButtonGroup.onChildInputOver.add(this.onOver, this);
    	this.continueButtonGroup.onChildInputOut.add(this.onOut, this);
		this.continueButtonGroup.onChildInputDown.add(this.continueGame, this);
	},

	continueGame: function () {
		this.game.state.start('Game');
	},

	onOver: function() {
		this.continueButtonGroup.children[1].tint = 0xe6e6e6;
		this.continueButtonGroup.children[2].tint = 0xe6e6e6;
	},

	onOut: function() {
		this.continueButtonGroup.children[1].tint = 0xffffff;
		this.continueButtonGroup.children[2].tint = 0xffffff;
	}
};
