//store all the UI parameters in the Ball structure
var Ball = {
    _WIDTH: 320,
    _HEIGHT: 480,
    fontSmall: { font: "16px Arial"},
    fontBig: { font: "24px Arial"},
    fontHuge: { font: "44px Arial"},
    white: {fill: "#FFFFFF"}
};
Ball.Boot = function(game) {};
Ball.Boot.prototype = {
    preload: function() {
        //Change and add the correct loading bar. Create png.
        this.load.image('preloaderBg', 'img/loading-bg.png');
        this.load.image('preloaderBar', 'img/loading-bar.png');
        
    },
    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.state.start('Preloader');
    }
};