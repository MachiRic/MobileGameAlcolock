Ball.Preloader = function(game) {};
Ball.Preloader.prototype = {
	preload: function() {
		//Preloads all the objects before they are shown. Important to load all images here! Otherwise we will have errors!!
		this.stage.backgroundColor = "#ffffff";
		//border
		this.border = this.game.add.graphics();
		this.border.lineStyle(8, 0x000000, 0.8);
		this.border.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT);
		//loading bar graphics
		var loadingBarBG = this.game.add.graphics();
		loadingBarBG.lineStyle(4, 0x000000, 1);
		loadingBarBG.drawRect(0, 0, Ball._WIDTH * 0.3, Ball._HEIGHT * 0.015);
		loadingBarBG.visible = false;
		var loadingBar = this.game.add.graphics();
		loadingBar.beginFill(0x000000);
		loadingBar.drawRect(0, 0, Ball._WIDTH * 0.3, Ball._HEIGHT * 0.015);
		loadingBar.endFill();
		loadingBar.visible = false;

		this.preloadBg = this.add.sprite(Ball._WIDTH*0.35, Ball._HEIGHT*0.4925, loadingBarBG.generateTexture());
		this.preloadBar = this.add.sprite(Ball._WIDTH*0.35, Ball._HEIGHT*0.4925, loadingBar.generateTexture());
		this.load.setPreloadSprite(this.preloadBar);

		this.imageFolder = "mazeImages";

		this.load.image('ball', this.imageFolder+'/ball.png');
		this.load.image('screen-mainmenu', this.imageFolder+'/screen-mainmenu.png');

		//audio source: https://freesound.org/people/JustInvoke/sounds/446100/
		//this.load.audio('audio-bounce', ['audio/collide.ogg', 'audio/collide.mp3']);
		//audio source: https://freesound.org/people/tack00/sounds/401592/
		this.load.audio('audio-vibration', ['audio/vibration.ogg', 'audio/vibration.mp3']);
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};