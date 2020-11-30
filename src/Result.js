Ball.Result = function(game) {};
Ball.Result.prototype = {
	create: function() {
        var style = { ...Ball.fontHuge, fontWeight: "bold"};
        var time = this.game.state.states['Game'].timer;
        var collisions = this.game.state.states['Game'].totalCollisions;

        if (time > 5 || collisions > 30){
            //fail page
            this.stage.backgroundColor = "#f55a52";
            this.passInfo = this.add.text(Ball._WIDTH*0.5, Ball._HEIGHT*1.0/3.0, 'Failed Test', style);
        }
        else{
            //success page
            this.stage.backgroundColor = "#89f483";
            this.passInfo = this.add.text(Ball._WIDTH*0.5, Ball._HEIGHT*1.0/3.0, 'Passed Test', style);
        }
        this.passInfo.anchor.setTo(0.5);
        this.passInfo.scale.setTo(Ball.scaleFactor);
        
        this.timeInfo = this.add.text(Ball._WIDTH*0.5, Ball._HEIGHT*(1.0/3.0+1.0/12.0), 'Time: ' + this.game.state.states['Game'].timer + 's', Ball.fontSmall);
        this.timeInfo.anchor.setTo(0.5);
        this.timeInfo.scale.setTo(Ball.scaleFactor);
        this.collisionInfo = this.add.text(Ball._WIDTH*0.5, Ball._HEIGHT*(1.0/3.0+1.0/12.0+1.0/25.0), 
            'Total collisions: ' + this.game.state.states['Game'].totalCollisions, Ball.fontSmall);
        this.collisionInfo.anchor.setTo(0.5);
        this.collisionInfo.scale.setTo(Ball.scaleFactor);
        //this.game.state.states['Game'].timer
	}
};