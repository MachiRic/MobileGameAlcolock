Ball.Game = function (game) { };
Ball.Game.prototype = {
	create: function () {
		//console.log("Version 0.3");
		//game background
		this.stage.backgroundColor = "#ffffff"; //background
		//Create the look of the game and the physics
		this.physics.startSystem(Phaser.Physics.ARCADE);	//Physics
		this.timer = 0;
		this.totalTimer = 0;
		this.totalCollisions = 0;
		this.movementForce = 10;
		this.down = false;
		this.prevCollision = false;

		this.prevBallCollidePositionX = 0;
		this.prevBallCollidePositionY = 0;

		this.vibrationSound = this.game.add.audio('audio-vibration');
		this.vibrationSound.volume = 0.5;
		//this.bounceSound = this.game.add.audio('audio-bounce');

		this.game.prevPos = [];

		/* Create maze
		 * reference: https://www.emanueleferonato.com/2015/06/30/pure-javascript-perfect-tile-maze-generation-with-a-bit-of-magic-thanks-to-phaser/
		 */
		//generate graphics
		var maze = []; //save states of all maze grids, 1 for wall/untouched, 0 for path/touched
		var moves = []; //save the current movements when finding the path
		var gridNum = { x: 9, y: 17 }; //determin the complexity of the maze (must be odd number)
		var mergePixel = 1.0;
		this.gridSize = { x: Ball._WIDTH / gridNum.x + mergePixel, y: 0.9 * Ball._HEIGHT / gridNum.y + mergePixel};
		//console.log(this.gridSize);
		//initialization
		for (var j = 0; j < gridNum.y; j++) {
			maze[j] = [];
			for (var i = 0; i < gridNum.x; i++) {
				maze[j][i] = 1;
			}
		}
		var posY = 1;
		var posX = 1;
		maze[posY][posX] = 0; //exit
		moves.push(posX + posY * gridNum.x);
		//finding path
		while (moves.length) {
			var possibleDirections = "";
			if (posY + 2 > 0 && posY + 2 < gridNum.y - 1 && maze[posY + 2][posX] == 1) {
				possibleDirections += "S";
			}
			if (posY - 2 > 0 && posY - 2 < gridNum.y - 1 && maze[posY - 2][posX] == 1) {
				possibleDirections += "N";
			}
			if (posX - 2 > 0 && posX - 2 < gridNum.x - 1 && maze[posY][posX - 2] == 1) {
				possibleDirections += "W";
			}
			if (posX + 2 > 0 && posX + 2 < gridNum.x - 1 && maze[posY][posX + 2] == 1) {
				possibleDirections += "E";
			}
			if (possibleDirections) {
				var tempMove = this.game.rnd.between(0, possibleDirections.length - 1);
				switch (possibleDirections[tempMove]) {
					case "N":
						maze[posY - 2][posX] = 0;
						maze[posY - 1][posX] = 0;
						posY -= 2;
						break;
					case "S":
						maze[posY + 2][posX] = 0;
						maze[posY + 1][posX] = 0;
						posY += 2;
						break;
					case "W":
						maze[posY][posX - 2] = 0;
						maze[posY][posX - 1] = 0;
						posX -= 2;
						break;
					case "E":
						maze[posY][posX + 2] = 0;
						maze[posY][posX + 1] = 0;
						posX += 2;
						break;
				}
				moves.push(posX + posY * gridNum.x);
			}
			else {
				var back = moves.pop();
				posY = Math.floor(back / gridNum.x);
				posX = back % gridNum.x;
			}
		}
		//maze physics
		this.mazeGroup = this.add.group();
		this.mazeGroup.enableBody = true;
		this.mazeGroup.physicsBodyType = Phaser.Physics.ARCADE;
		//draw the maze using triangles
		var mazeGridGraphics = this.game.add.graphics();
		mazeGridGraphics.beginFill(0x000000);
		mazeGridGraphics.drawRect(0, 0, this.gridSize.x, this.gridSize.y);
		mazeGridGraphics.endFill();
		mazeGridGraphics.visible = false;
		for (j = 0; j < gridNum.y; j++) {
			for (i = 0; i < gridNum.x; i++) {
				if (maze[j][i] == 1) {
					if (j == gridNum.y - 2 && i == gridNum.x - 2) continue; //avoid wall at the start position
					/*
					var tempMazeGridSprite = this.game.add.sprite(i * (this.gridSize.x-mergePixel)-0.5*mergePixel, 
						j * (this.gridSize.y-mergePixel)-0.5*mergePixel + 0.1 * Ball._HEIGHT
						, mazeGridGraphics.generateTexture());
					this.mazeGroup.add(tempMazeGridSprite);*/
					this.mazeGroup.create(i * (this.gridSize.x-mergePixel)-0.5*mergePixel, 
					j * (this.gridSize.y-mergePixel)-0.5*mergePixel + 0.1 * Ball._HEIGHT, 
					mazeGridGraphics.generateTexture());
				}
			}
		}
		this.mazeGroup.setAll('body.immovable', true);

		//Create the goal of the game, the hole
		var holeGraphics = this.game.add.graphics();
		holeGraphics.beginFill(0x89f483);
		holeGraphics.drawRect(0, 0, this.gridSize.x-mergePixel*2, this.gridSize.y-mergePixel*2);
		holeGraphics.endFill();
		holeGraphics.visible = false;
		this.hole = this.add.sprite(this.gridSize.x-mergePixel*0.5, this.gridSize.y-mergePixel*0.5 + 0.1 * Ball._HEIGHT, holeGraphics.generateTexture());
		this.exitText = this.game.add.text((this.gridSize.x-mergePixel) * 1.5, (this.gridSize.y-mergePixel) * 1.5 + 0.1 * Ball._HEIGHT, "E", { ...Ball.fontBig });
		var exitScale = (this.gridSize.x / 68.0 < this.gridSize.y / 57.0) ? this.gridSize.x / 68.0 : this.gridSize.y / 57.0;
		this.exitText.scale.setTo(exitScale); //68.0 and 57.0 are factors to keep suitable size of E
		this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.exitText.anchor.setTo(0.5);
		//this.hole.body.setSize(2, 2);

		var ballScaleFactor = 0.65 * ((this.gridSize.x < this.gridSize.y) ? this.gridSize.x : this.gridSize.y);
		//Create the ball and add physics
		this.ball = this.add.sprite((gridNum.x - 1.5) * (this.gridSize.x-mergePixel), (gridNum.y - 1.5) * (this.gridSize.y-mergePixel) + 0.1 * Ball._HEIGHT, 'ball');
		this.ball.anchor.set(0.5);
		this.ball.scale.setTo(ballScaleFactor / this.ball.height);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		console.log(this.ball.width);
		console.log(this.ball.height);
		//this.ball.body.setSize(18, 18);
		this.ball.body.bounce.set(0.3, 0.3);


		//var latestGood = this.ball.position;
		//Input from keyboard
		this.keys = this.game.input.keyboard.createCursorKeys();

		//Update game every second (only timer or everything?)
		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.border = this.game.add.graphics();
		this.border.lineStyle(8, 0x000000, 0.8);
		this.border.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT);
		this.borderGroup.add(this.border);
		this.panel = this.game.add.graphics();
		this.panel.beginFill(0x000000, 0.8);
		this.panel.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT * 0.1);
		this.borderGroup.add(this.panel);
		this.borderGroup.setAll('body.immovable', true);
		//this.bounceSound = this.game.add.audio('audio-bounce');

		this.timerText = this.game.add.text(0.05 * Ball._WIDTH, Ball._HEIGHT * 0.05, "Time: " + this.timer, { ...Ball.fontBig, ...Ball.white });
		this.timerText.anchor.setTo(0, 0.5);
		this.timerText.scale.setTo(Ball.scaleFactor);
		this.totalCollisionsText = this.game.add.text(0.4 * Ball._WIDTH, Ball._HEIGHT * 0.05, "Collisions: " + this.totalCollisions, { ...Ball.fontBig, ...Ball.white });
		this.totalCollisionsText.anchor.setTo(0, 0.5);
		this.totalCollisionsText.scale.setTo(Ball.scaleFactor);

		//for eye-tracking
		this.xPredicted = Ball.xprediction * Ball._WIDTH/Ball.realWidth;
		this.yPredicted = Ball.yprediction * Ball._HEIGHT/Ball.realHeight;
	},

	update: function () {

		this.xPredicted = Ball.xprediction * Ball._WIDTH/Ball.realWidth;
		this.yPredicted = Ball.yprediction * Ball._HEIGHT/Ball.realHeight
		console.log(this.xPredicted + ', ' + this.yPredicted);

		var xOffset = this.xPredicted - Ball._WIDTH/2.0;
		var yOffset = this.yPredicted - Ball._HEIGHT/2.0;

		if(xOffset < 0) {
			this.ball.body.velocity.x -= this.movementForce;
			console.log("left");
		}
		else if(xOffset >= 0) {
			this.ball.body.velocity.x += this.movementForce;
			console.log("right");
		}
		if(yOffset < 0) {
			this.ball.body.velocity.y -= this.movementForce;
			console.log("up");
		}
		else if(yOffset >= 0) {
			this.ball.body.velocity.y += this.movementForce;
			console.log("down");
		}
		//this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		this.physics.arcade.collide(this.ball, this.mazeGroup, this.wallCollision, null, this);
		this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);


		//this.cursor.position.x = Ball.xprediction * Ball._WIDTH/Ball.realWidth;
		//this.cursor.position.y = Ball.yprediction * Ball._HEIGHT/Ball.realHeight;
	},

	updateCounter: function () {
		//Update the timer every second in the game
		this.timer++;
		this.timerText.setText("Time: " + this.timer);
		//this.totalTimeText.setText("Total time: "+(this.totalTimer+this.timer));
	},

	wallCollision: function (collision) {
		//console.log("wall collision");
		//Here we see what happens when we hit a wall.
		this.totalCollisions++;
		this.totalCollisionsText.setText("Collisions: " + this.totalCollisions);
		if (window.navigator && window.navigator.vibrate) {
			// Vibration supported
			window.navigator.vibrate(100);
		 } else {
			// Vibration not supported
			if (!this.vibrationSound.isPlaying){
				this.vibrationSound.play();
			}
		 }
	},

	finishLevel: function () {
		this.game.state.start('Result');
	}
};
