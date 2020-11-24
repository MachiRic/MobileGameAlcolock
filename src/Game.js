Ball.Game = function (game) { };
Ball.Game.prototype = {
	create: function () {
		//Create the look of the game and the physics
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(0, 0, 'panel');
		this.physics.startSystem(Phaser.Physics.ARCADE);	//Physics
		//this.fontMessage = { font: "24px Arial", fill: "#e4beef", align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.audioStatus = true;
		this.timer = 0;
		this.totalTimer = 0;
		this.totalCollisions = 0;
		this.level = 1;
		this.maxLevels = 1;
		this.movementForce = 10;
		this.ballStartPos = { x: Ball._WIDTH * 0.5, y: 450 };
		this.down = false;

		//Create buttons
		/*
		this.pauseButton = this.add.button(Ball._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.audioButton = this.add.button(Ball._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
		*/
		this.timerText = this.game.add.text(15, 15, "Time: " + this.timer, {...Ball.fontBig, ...Ball.white});
		//this.levelText = this.game.add.text(120, 10, "Level: " + this.level + " / " + this.maxLevels, {...Ball.fontSmall, ...Ball.white});
		//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontSmall );
		this.totalCollisionsText = this.game.add.text(120, 15, "Total collisions: " + this.totalCollisions, {...Ball.fontBig, ...Ball.white});

		//Create the goal of the game, the hole
		this.hole = this.add.sprite(Ball._WIDTH * 0.5, 90, 'hole');
		this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.hole.anchor.set(0.5);
		this.hole.body.setSize(2, 2);

		//Create the ball and add physics
		this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.ball.anchor.set(0.5);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		this.ball.body.setSize(18, 18);
		this.ball.body.bounce.set(0.3, 0.3);


		//Initialise levels
		this.initLevels();
		this.showLevel(1);

		//User input
		this.keys = this.game.input.keyboard.createCursorKeys();
		this.playerInput = this.game.input.addMoveCallback(this.clicked, this.ball);
		//this.playerInput = setInteractiveCandidateHandler(this.clicked, this);
		//mouse+touch
		//this.game.input.onHold.add(this.clicked, this);
		
		/*if (this.game.input.isDown){
			console.log("is down");
		}*/
		/*
		var mySignal = new Phaser.Signal();
		
		mySignal.dispatch(this.game.input.pointer.isDown);
		mySignal.add(this.clicked, this);
		*/

		//this.game.input.onDown.add(function() { console.log("clicked") });
		//Create player and input from device as orientation
		Ball._player = this.ball;
		window.addEventListener("deviceorientation", this.handleOrientation, true);

		//Update game every second (only timer or everything?)
		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Ball._HEIGHT - 2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Ball._WIDTH - 2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
		this.bounceSound = this.game.add.audio('audio-bounce');
	},
	initLevels: function () {
		//This is where we create the levels!!!
		this.levels = [];
		this.levelData = [
			[	//Level 1
				{ x: 188, y: 352, t: 'h' },	//h stands for height, which I think means that the wall will be vertical
				{ x: 92, y: 320, t: 'w' },	//w stands for width, which I think means that the wall will be horizontal
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 256, y: 240, t: 'h' },
				{ x: 180, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			],
			[	//Level 2
				{ x: 72, y: 320, t: 'w' },
				{ x: 200, y: 320, t: 'h' },
				{ x: 72, y: 150, t: 'w' }
			],
			[	//Level 3
				{ x: 64, y: 352, t: 'h' },
				{ x: 224, y: 352, t: 'h' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 200, y: 52, t: 'h' }
			],
			[	//Level 4
				{ x: 78, y: 352, t: 'h' },
				{ x: 78, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 192, y: 240, t: 'w' },
				{ x: 30, y: 150, t: 'w' },
				{ x: 158, y: 150, t: 'w' }
			],
			[	//Level 5
				{ x: 188, y: 352, t: 'h' },
				{ x: 92, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 256, y: 240, t: 'h' },
				{ x: 180, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			]
		];
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
	showLevel: function (level) {
		var lvl = level | this.level;
		if (this.levels[lvl - 2]) {
			this.levels[lvl - 2].visible = false;
		}
		this.levels[lvl - 1].visible = true;
	},
	updateCounter: function () {
		//Update the timer every second in the game
		this.timer++;
		this.timerText.setText("Time: " + this.timer);
		//this.totalTimeText.setText("Total time: "+(this.totalTimer+this.timer));
	},
	/*managePause: function() {
		//Pause button. Probably should be removed
		this.game.paused = true;
		var pausedText = this.add.text(Ball._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},*/
	/*manageAudio: function() {
		//The audio, which also should be removed?
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},*/
	update: function () {
		//Input from user, should change to touch
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
		//Add physics for collisions with walls.
		this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		this.physics.arcade.collide(this.ball, this.levels[this.level - 1], this.wallCollision, null, this);
		this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
	},
	wallCollision: function () {
		//Here we see what happens when we hit a wall. Maybe we can add a hit counter here?
		if (this.audioStatus) {
			this.bounceSound.play();
		}
		// Vibration API. Should we keep this??
		
		if ("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}
		this.totalCollisions++;
		this.totalCollisionsText.setText("Total collisions: " + this.totalCollisions);
	},
	handleOrientation: function (e) {
		//Prob don't need this.
		// Device Orientation API
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		Ball._player.body.velocity.x += x;
		Ball._player.body.velocity.y += y * 0.5;
	},
	clicked: function (pointer, x, y) {
		if (pointer.isDown){
			//console.log("is down");
			this.down = true;
			console.log(pointer);
			console.log("x: "+x);
			console.log("y: "+y);
		}
		else {
			this.down = false;
		}
	},
	
	finishLevel: function () {
		//This decide what happens when we finish the level. We should probably show a new screen instead of a popup window
		if (this.level >= this.maxLevels) {
			this.totalTimer += this.timer;
			//alert('Congratulations, game completed!\nTotal time of play: ' + this.totalTimer + ' seconds!');
			//this.game.state.start('MainMenu');
			this.game.state.start('Result');
		}
		else {
			//Change this to a new screen instead of popup!
			alert('Congratulations, level ' + this.level + ' completed!');
			this.totalTimer += this.timer;
			this.timer = 0;
			this.level++;
			this.timerText.setText("Time: " + this.timer);
			//this.totalTimeText.setText("Total time: "+this.totalTimer);
			this.totalCollisionsText.setText("Total collisions: " + this.totalCollisions);
			this.levelText.setText("Level: " + this.level + " / " + this.maxLevels);
			this.ball.body.x = this.ballStartPos.x;
			this.ball.body.y = this.ballStartPos.y;
			this.ball.body.velocity.x = 0;
			this.ball.body.velocity.y = 0;
			this.showLevel();
		}
	},
	render: function () {
		// this.game.debug.body(this.ball);
		// this.game.debug.body(this.hole);
	}
};