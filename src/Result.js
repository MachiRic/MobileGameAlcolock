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

        //title position
        var titlePos;

        if (testMode) {
            titlePos = 1.0 / 5.0;

            this.stage.backgroundColor = "#ffffff";
            this.passInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * titlePos, 'Test Results', style);

            this.bar = this.game.add.graphics();
            this.bar.beginFill(0x000000, 0.8);
            this.bar.drawRect(0, Ball._HEIGHT * (titlePos + 1.0 / 12.0 + 2.0 / 25.0)
                , Ball._WIDTH, Ball._HEIGHT * 0.15);
            this.bar.endFill();

            var text = "Before taking the survey, please make sure you remember the time and total collisions to fill in :)";
            //this.remindText = this.game.add.text(Ball._WIDTH * 0.04, Ball._HEIGHT * (titlePos + 1.0 / 12.0 + 2.0 / 25.0+0.04), text, 
                //{ font: Ball.scaleFactor * 24 + "px joystix", ...Ball.white });
            this.remindText = this.game.add.text(0,0,text,{font: Ball.scaleFactor * 24 + "px joystix", ...Ball.white, boundsAlignH: "center", boundsAlignV: "middle"});
            this.remindText.wordWrap = true;
            this.remindText.wordWrapWidth = 0.92 * Ball._WIDTH;
            this.remindText.setTextBounds(0, Ball._HEIGHT * (titlePos + 1.0 / 12.0 + 2.0 / 25.0)
            , Ball._WIDTH, Ball._HEIGHT * 0.15);

            //survey button
            //graphics
            this.surveyButton = [];
            this.surveyButton.push(this.game.add.graphics()); //border
            this.surveyButton.push(this.game.add.graphics()); //background
            this.surveyButton.push(this.game.add.text(0, 0, "Survey", { ...Ball.fontBig })); //text
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
            this.surveyButtonGroup.y = Ball._HEIGHT * (titlePos + 1.0 / 12.0 + 3.0 / 25.0 + 0.15 + 0.025);
            this.surveyButtonGroup.onChildInputDown.add(this.startSurvey, this);

            //restartbutton
            //graphics
            this.restartButton = [];
            this.restartButton.push(this.game.add.graphics()); //border
            this.restartButton.push(this.game.add.graphics()); //background
            this.restartButton.push(this.game.add.text(0, 0, "Restart", { ...Ball.fontBig, fill: "#707070" })); //text
            this.restartButton[2].anchor.setTo(0.5);
            this.restartButton[2].scale.setTo(Ball.scaleFactor);
            this.restartButton[0].beginFill(0x000000, 0);
            this.restartButton[0].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
            this.restartButton[0].endFill();
            this.restartButton[1].lineStyle(4, 0x707070, 1);
            this.restartButton[1].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);
            //behaviour
            this.restartButtonGroup = this.game.add.group();
            this.restartButtonGroup.inputEnableChildren = true;
            this.restartButtonGroup.addMultiple(this.restartButton);
            this.restartButtonGroup.x = Ball._WIDTH * 0.5;
            this.restartButtonGroup.y = Ball._HEIGHT * (titlePos + 1.0 / 12.0 + 4.0 / 25.0 + 0.15 + 0.075);
            this.restartButtonGroup.onChildInputDown.add(this.restart, this);
        }
        else {
            titlePos = 1.0 / 3.0;
            if (time > 5 || collisions > 30) {
                //fail page
                this.stage.backgroundColor = "#f55a52";
                this.passInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * titlePos, 'Failed Test', style);
            }
            else {
                //success page
                this.stage.backgroundColor = "#89f483";
                this.passInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * titlePos, 'Passed Test', style);
            }
        }

        this.passInfo.anchor.setTo(0.5);
        this.passInfo.scale.setTo(Ball.scaleFactor);

        this.timeInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * (titlePos + 1.0 / 12.0), 'Time: ' + this.game.state.states['Game'].timer + 's', Ball.fontSmall);
        this.timeInfo.anchor.setTo(0.5);
        this.timeInfo.scale.setTo(Ball.scaleFactor);
        this.collisionInfo = this.add.text(Ball._WIDTH * 0.5, Ball._HEIGHT * (titlePos + 1.0 / 12.0 + 1.0 / 25.0),
            'Total collisions: ' + this.game.state.states['Game'].totalCollisions, Ball.fontSmall);
        this.collisionInfo.anchor.setTo(0.5);
        this.collisionInfo.scale.setTo(Ball.scaleFactor);
    },
    startSurvey: function () {
        //window.open("http://www.google.com", "_blank");
        window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSf80n1xFap6B8PLj0u0lDWeUB7IyTVCD9JiVY1FLROjLX6BYw/viewform";
    },
    restart: function(){
        this.game.state.start('Game');
    }
};