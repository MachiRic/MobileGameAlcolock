Ball.Preloader = function(game) {};
Ball.Preloader.prototype = {
    preload: function() {
        //Add the correct preloaders (loading bars)
        //this.preloadBg = this.add.sprite((Ball._WIDTH-297)*0.5, (Ball._HEIGHT-145)*0.5, 'preloaderBg');
        //this.preloadBar = this.add.sprite((Ball._WIDTH-158)*0.5, (Ball._HEIGHT-50)*0.5, 'preloaderBar');
        //this.load.setPreloadSprite(this.preloadBar);

        this.load.image('ball', 'img/ball.png'); //Change to another image later!
        // ...
        this.load.spritesheet('button-start', 'img/button-start.png', 146, 51); //Change later!
        // ...
        //this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']); Shouldn't need this
    },
    create: function() {
        this.game.state.start('MainMenu');
    }
};