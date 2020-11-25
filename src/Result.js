Ball.Result = function(game) {};
Ball.Result.prototype = {
	create: function() {
        var style = { ...Ball.fontHuge, fontWeight: "bold"};

        this.add.sprite(0, 0, 'screen-bg-passed');
        this.passInfo = this.add.text(Ball._WIDTH*0.5, 200, 'Passed Test', style);
        this.passInfo.anchor.setTo(0.5);
        this.timeInfo = this.add.text(Ball._WIDTH*0.5, 240, 'Time: ' + this.game.state.states['Game'].timer + 's', Ball.fontSmall);
        this.timeInfo.anchor.setTo(0.5);
        this.collisionInfo = this.add.text(Ball._WIDTH*0.5, 265, 
            'Total collisions: ' + this.game.state.states['Game'].totalCollisions, Ball.fontSmall);
        this.collisionInfo.anchor.setTo(0.5);
        //this.game.state.states['Game'].timer
	}
};