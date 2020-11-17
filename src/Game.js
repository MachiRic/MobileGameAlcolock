Ball.Game = function (game) { };
Ball.Game.prototype = {
    create: function () {
        //create ball
        this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');  //Change to another image
        this.ball.anchor.set(0.5);
        this.physics.enable(this.ball, Phaser.Physics.ARCADE);  //Maybe we should change physics later on??
        this.ball.body.setSize(18, 18);
        this.ball.body.bounce.set(0.3, 0.3);

        //Create input from user
        this.keys = this.game.input.keyboard.createCursorKeys();    //input from user, change to touch!

        //Create goal, in this case a hole. 
        this.hole = this.add.sprite(Ball._WIDTH * 0.5, 90, 'hole'); //Change image, maybe not a hole?
        this.physics.enable(this.hole, Phaser.Physics.ARCADE);
        this.hole.anchor.set(0.5);
        this.hole.body.setSize(2, 2);

        //Create a timer
        this.timer = 0; // time elapsed in the current level
        this.totalTimer = 0; // time elapsed in the whole game
        //Show timer to the user, this should probably be modified.
        this.timerText = this.game.add.text(15, 15, "Time: " + this.timer, this.fontBig);
        this.totalTimeText = this.game.add.text(120, 30, "Total time: " + this.totalTimer, this.fontSmall);
        //Will update the counter every second
        this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

    },
    //initializes the level data
    initLevels: function () {

        //Can apparently use level editor, we should look that up. At the moment I didn't use level editor.
        this.levelData = [
            [
                { x: 96, y: 224, t: 'w' }
            ],
            [
                { x: 72, y: 320, t: 'w' },
                { x: 200, y: 320, t: 'h' },
                { x: 72, y: 150, t: 'w' }
            ],
            // ...
        ];

        //Create levels? 
        for (var i = 0; i < this.maxLevels; i++) {
            var newLevel = this.add.group();
            newLevel.enableBody = true;
            newLevel.physicsBodyType = Phaser.Physics.ARCADE;
            for (var e = 0; e < this.levelData[i].length; e++) {
                var item = this.levelData[i][e];
                newLevel.create(item.x, item.y, 'element-' + item.t);
            }
            newLevel.setAll('body.immovable', true);
            newLevel.visible = false;
            this.levels.push(newLevel);
        }

    },
    //Prints level data on the screen
    showLevel: function (level) {
        var lvl = level | this.level;
        if (this.levels[lvl - 2]) {
            this.levels[lvl - 2].visible = false;
        }
        this.levels[lvl - 1].visible = true;
    },
    //Update the time spent playing each level + total time played
    updateCounter: function () {
        //Update the time shown every second?
        this.timer++;
        this.timerText.setText("Time: " + this.timer);
        this.totalTimeText.setText("Total time: " + (this.totalTimer + this.timer));
    },
    //managePause: function() {}, //pauses and resumes the game, don't need to pause the game, that's cheating :)
    //manageAudio: function() {},
    update: function () {
        //Change so that it works with touch in the future! Also, should we change physics?
        if (this.keys.left.isDown) {
            this.ball.body.velocity.x -= this.movementForce;
        }
        else if (this.keys.right.isDown) {
            this.ball.body.velocity.x += this.movementForce;
        }
        if (this.keys.up.isDown) {
            this.ball.body.velocity.y -= this.movementForce;
        }
        else if (this.keys.down.isDown) {
            this.ball.body.velocity.y += this.movementForce;
        }

        //Collision detection for when the player hits the walls
        this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
        this.physics.arcade.collide(this.ball, this.levels[this.level - 1], this.wallCollision, null, this);

        //When the player hits the hole, the finishlevel function is executed
        this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
    },
    wallCollision: function () { },   //is executed when the ball hits the walls or objects
    handleOrientation: function (e) { },  //device orientation, don't need?
    finishLevel: function () {
        //Shown when the player finishes the game
        if (this.level >= this.maxLevels) {
            this.totalTimer += this.timer;
            alert('Congratulations, game completed!\nTotal time of play: ' + this.totalTimer + ' seconds!');
            this.game.state.start('MainMenu');
        }
        //Shown when the player finishes a level, we should change this since we'll only have one level
        else {
            alert('Congratulations, level ' + this.level + ' completed!');
            this.totalTimer += this.timer;
            this.timer = 0;
            this.level++;
            this.timerText.setText("Time: " + this.timer);
            this.totalTimeText.setText("Total time: " + this.totalTimer);
            this.levelText.setText("Level: " + this.level + " / " + this.maxLevels);
            this.ball.body.x = this.ballStartPos.x;
            this.ball.body.y = this.ballStartPos.y;
            this.ball.body.velocity.x = 0;
            this.ball.body.velocity.y = 0;
            this.showLevel();
        }
    }  //Loads new level when the current one is completed. Should change this to an end image!
};



