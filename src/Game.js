Ball.Game = function (game) { };
Ball.Game.prototype = {
	create: function () {
		//game background
		this.stage.backgroundColor = "#ffffff"; //background
		//Create the look of the game and the physics
		this.physics.startSystem(Phaser.Physics.ARCADE);	//Physics
		//this.fontMessage = { font: "24px Arial", fill: "#e4beef", align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.audioStatus = true;
		this.timer = 0;
		this.totalTimer = 0;
		this.totalCollisions = 0;
		this.level = 1;
		this.maxLevels = 1;
		this.movementForce = 10;
		this.ballStartPos = { x: Ball._WIDTH * 0.5, y: Ball._HEIGHT*0.95 };
		this.down = false;
		this.prevCollision = false;

		this.game.prevPos = [];

		//this.timerText = this.game.add.text(15, 15, "Time: " + this.timer, this.fontBig);
		//this.levelText = this.game.add.text(120, 10, "Level: " + this.level + " / " + this.maxLevels, this.fontSmall);
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
		
		//Create the goal of the game, the hole
		this.hole = this.add.sprite(Ball._WIDTH * 0.5, Ball._HEIGHT*0.15, 'hole');
		//this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.hole.anchor.set(0.5);
		//this.hole.body.setSize(2, 2);

		//Create the ball and add physics
		this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.ball.anchor.set(0.5);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		this.ball.body.setSize(18, 18);
		this.ball.body.bounce.set(0.3, 0.3);

		this.cursor = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.cursor.alpha = 0;



		//var latestGood = this.ball.position;
		//Input from keyboard
		this.keys = this.game.input.keyboard.createCursorKeys();



		//  Input Enable the sprites
		this.ball.inputEnabled = true;

		//  Allow dragging - the 'true' parameter will make the sprite snap to the center
		//this.ball.input.enableDrag(true);
		//console.log(this.ball.events);

		//Initialise levels
		this.initLevels();
		this.showLevel(1);

		//Create player and input from device as orientation
		Ball._player = this.ball;
		//window.addEventListener("deviceorientation", this.handleOrientation, true);

		//Update game every second (only timer or everything?)
		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.border = this.game.add.graphics();
		this.border.lineStyle(8, 0x000000, 0.8);
		this.border.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT);
		this.panel = this.game.add.graphics();
		this.panel.beginFill(0x000000, 0.8);
		this.panel.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT * 0.1);
		this.borderGroup.add(this.panel);
		this.borderGroup.setAll('body.immovable', true);
		//this.bounceSound = this.game.add.audio('audio-bounce');

		this.timerText = this.game.add.text(0.05*Ball._WIDTH, Ball._HEIGHT * 0.05, "Time: " + this.timer, {...Ball.fontBig, ...Ball.white});
		this.timerText.anchor.setTo(0, 0.5);
		this.totalCollisionsText = this.game.add.text(0.4*Ball._WIDTH, Ball._HEIGHT * 0.05, "Collisions: " + this.totalCollisions, {...Ball.fontBig, ...Ball.white});
		this.totalCollisionsText.anchor.setTo(0, 0.5);

		//this.startButton[1].lineStyle(4, 0xffffff, 1);
		//this.startButton[1].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);

		

		//this.ball.body.collideWorldBounds = true;
		//this.ball.body.bounce.set(0.9);

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

	update: function () {

		//console.log("at start of update, Previous position: " + this.game.prevPos)
		//console.log("Input: ", this.game.input);
		//console.log("Pointer pos: ", this.game.input.activePointer.position);
		//console.log("Ball pos: ", this.ball.position);

		//Check if the level is finished
		if (this.checkOverlap(this.ball, this.hole)) { this.finishLevel() }

		//Check if the user is pressing the mouse or touch down
		//if (this.game.input.activePointer.isDown) {
			this.cursor.position.x = this.game.input.activePointer.position.x;
			this.cursor.position.y = this.game.input.activePointer.position.y;
		//}



		//Start by setting collision to false
		collision = false;

		//In a for loop, check all walls in the game and see if the user is colliding or overlapping with the walls.
		for (i = 0; i < this.levels[this.level - 1].children.length; i++) {
			if (this.checkOverlap(this.cursor, this.levels[this.level - 1].children[i])) {
				//If they overlap with at least one wall we set the collision to true.
				collision = true;
			}
		}
		//console.log("Collission check complete, current prevpos: " + this.game.prevPos)

		//If the user collided with any of the walls we set the position of the ball to the third latest position. I should probably make this better
		if (collision) {
			//console.log('Overlapping: true');
			//if (this.ball.input.isDragged) {	//Double check that we are actually moving the ball
			if (this.checkOverlap(this.cursor, this.ball)) {
				//If we have a collision with the ball we call the wallCollision function
				this.wallCollision(collision);	//Now it's being called every frame we collide, maybe we want to use this to count the time colliding??
				//var previous = this.game.prevPos[0];
				//this.ball.position.x = previous[0];
				//this.ball.position.y = previous[1];
			}

			//}
		}
		else {
			//If we don't find any overlaps we add the current position of the ball in the prevPos array
			//console.log('Overlapping: false');
			if (this.checkOverlap(this.cursor, this.ball)) {
				//console.log("Dragging ball");
				this.ball.position.x = this.cursor.position.x;
				this.ball.position.y = this.cursor.position.y;
			//console.log("found no overlaps, current prevPos: " + this.game.prevPos)
			//var latestGood = [this.ball.position.x, this.ball.position.y];
			//this.game.prevPos.push(latestGood);
			//if (this.game.prevPos.length > 3) {
			//	this.game.prevPos.shift();
			//}

			// console.log("reassigned prevPos, current value: " + this.ball.prevPos)
			}
		}
		this.prevCollision = collision;
		//console.log("At end of update loop, prevPos: " + this.game.prevPos)
	},

	checkOverlap: function (spriteA, spriteB) {
		//Check if two sprites overlap, or "collide"
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		return Phaser.Rectangle.intersects(boundsA, boundsB);
	},

	wallCollision: function (collission) {
		//console.log("wall collision");
		//Here we see what happens when we hit a wall.
		if (!this.prevCollision) {
			this.totalCollisions++;
			this.totalCollisionsText.setText("Collisions: " + this.totalCollisions);
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