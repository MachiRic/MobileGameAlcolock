Ball.Result = function (game) { };
Ball.Result.prototype = {
    create: function () {
        var style = { ...Ball.fontHuge, fontWeight: "bold" };
        var time = this.game.state.states['Game'].timer;
        var collisions = this.game.state.states['Game'].totalCollisions;
        var testMode = 1; //whether this version is for user test

        //border
        this.border = this.game.add.graphics();
        this.border.lineStyle(8, 0x000000, 0.8);
        this.border.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT);

        if (testMode) {
            this.stage.backgroundColor = "#ffffff";
            this.passInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * 1.0 / 3.0, 'Test Results', style);

            //survey button
            //graphics
            this.surveyButton = [];
            this.surveyButton.push(this.game.add.graphics()); //border
            this.surveyButton.push(this.game.add.graphics()); //background
            this.surveyButton.push(this.game.add.text(0, 0, "Survey", { ...Ball.fontBig})); //text
            this.surveyButton[2].anchor.setTo(0.5);
            this.surveyButton[2].scale.setTo(Ball.scaleFactor);
            this.surveyButton[0].beginFill(0x000000, 0);
            this.surveyButton[0].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
            this.surveyButton[0].endFill();
            this.surveyButton[1].lineStyle(4, 0x000000, 1);
            this.surveyButton[1].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
            //behaviour
            this.surveyButtonGroup = this.game.add.group();
            this.surveyButtonGroup.inputEnableChildren = true;
            this.surveyButtonGroup.addMultiple(this.surveyButton);
            this.surveyButtonGroup.x = Ball._WIDTH * 0.5;
            this.surveyButtonGroup.y = Ball._HEIGHT * 0.55;
            this.surveyButtonGroup.onChildInputDown.add(this.startSurvey, this);
        }
        else {
            if (time > 5 || collisions > 30) {
                //fail page
                this.stage.backgroundColor = "#f55a52";
                this.passInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * 1.0 / 3.0, 'Failed Test', style);
            }
            else {
                //success page
                this.stage.backgroundColor = "#89f483";
                this.passInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * 1.0 / 3.0, 'Passed Test', style);
            }
        }
        this.passInfo.anchor.setTo(0.5);
        this.passInfo.scale.setTo(Ball.scaleFactor);

        this.timeInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * (1.0 / 3.0 + 1.0 / 12.0), 'Time: ' + this.game.state.states['Game'].timer + 's', Ball.fontSmall);
        this.timeInfo.anchor.setTo(0.5);
        this.timeInfo.scale.setTo(Ball.scaleFactor);
        this.collisionInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * (1.0 / 3.0 + 1.0 / 12.0 + 1.0 / 25.0),
            'Total collisions: ' + this.game.state.states['Game'].totalCollisions, Ball.fontSmall);
        this.collisionInfo.anchor.setTo(0.5);
        this.collisionInfo.scale.setTo(Ball.scaleFactor);
        //this.game.state.states['Game'].timer
    },
    startSurvey: function(){
        //window.open("http://www.google.com", "_blank");
        window.location.href = "http://www.google.com";
    }
};