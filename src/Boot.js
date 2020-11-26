//store all the common UI parameters in the Ball structure
var Ball = {
    fontSmall: { font: "26px joystix"},
    fontBig: { font: "48px joystix"},
    fontHuge: { font: "72px joystix"},
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
        //HACK TO PRELOAD A CUSTOM FONT
		this.game.add.text(0, 0, "hack", {font:"1px joystix", fill:"rgba(0,0,0,0)"});
        this.game.add.text(0, 0, "hack", {font:"1px 3Dpixel", fill:"rgba(0,0,0,0)"});
        
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.state.start('Preloader');
    }
};