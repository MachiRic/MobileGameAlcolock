Ball.Preloader = function(game) {};
Ball.Preloader.prototype = {
	preload: function() {
		//Preloads all the objects before they are shown. Important to load all images here! Otherwise we will have errors!!
		this.preloadBg = this.add.sprite((Ball._WIDTH-297)*0.5, (Ball._HEIGHT-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((Ball._WIDTH-158)*0.5, (Ball._HEIGHT-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.imageFolder = "mazeImages";

		this.load.image('ball', this.imageFolder+'/ball.png');
		this.load.image('hole', this.imageFolder+'/hole.png');
		this.load.image('element-w', this.imageFolder+'/element-w.png');
		this.load.image('element-h', this.imageFolder+'/element-h.png');
		this.load.image('panel', this.imageFolder+'/panel.png');
		this.load.image('title', this.imageFolder+'/title.png');
		this.load.image('button-pause', this.imageFolder+'/button-pause.png');
		this.load.image('screen-bg', this.imageFolder+'/screen-bg.png');
		this.load.image('screen-mainmenu', this.imageFolder+'/screen-mainmenu.png');
		this.load.image('screen-howtoplay', this.imageFolder+'/screen-howtoplay.png');
		this.load.image('border-horizontal', this.imageFolder+'/border-horizontal.png');
		this.load.image('border-vertical', this.imageFolder+'/border-vertical.png');

		this.load.image('screen-bg-passed', this.imageFolder+'/screen-bg-passed.png');

		this.load.spritesheet('button-audio', this.imageFolder+'/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', this.imageFolder+'/button-start.png', 146, 51);

		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};