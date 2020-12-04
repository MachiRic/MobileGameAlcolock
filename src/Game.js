Ball.Game = function (game) { };
Ball.Game.prototype = {
	create: function () {
		console.log("Version 0.3");
		//game background
		this.stage.backgroundColor = "#ffffff"; //background
		//Create the look of the game and the physics
		//this.physics.startSystem(Phaser.Physics.ARCADE);	//Physics
		this.timer = 0;
		this.totalTimer = 0;
		this.totalCollisions = 0;
		this.movementForce = 10;
		this.down = false;
		this.prevCollision = false;

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
		console.log(this.gridSize);
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
		//this.mazeGroup.physicsBodyType = Phaser.Physics.ARCADE;
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
					var tempMazeGridSprite = this.game.add.sprite(i * (this.gridSize.x-mergePixel)-0.5*mergePixel, 
						j * (this.gridSize.y-mergePixel)-0.5*mergePixel + 0.1 * Ball._HEIGHT
						, mazeGridGraphics.generateTexture());
					this.mazeGroup.add(tempMazeGridSprite);
				}
			}
		}
		//this.mazeGroup.setAll('body.immovable', true);

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
		this.exitText.anchor.setTo(0.5);
		//this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		//this.hole.body.setSize(2, 2);

		var ballScaleFactor = 0.65 * ((this.gridSize.x < this.gridSize.y) ? this.gridSize.x : this.gridSize.y);
		//Create the ball and add physics
		this.ball = this.add.sprite((gridNum.x - 1.5) * (this.gridSize.x-mergePixel), (gridNum.y - 1.5) * (this.gridSize.y-mergePixel) + 0.1 * Ball._HEIGHT, 'ball');
		this.ball.anchor.set(0.5);
		this.ball.scale.setTo(ballScaleFactor / this.ball.height);
		//this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		//this.ball.body.setSize(this.ball.width, this.ball.height);
		//this.ball.body.bounce.set(0.3, 0.3);

		this.cursor = this.add.sprite(0, 0, 'ball');
		this.cursor.anchor.setTo(0.5);
		this.cursor.alpha = 0;
		this.cursor.scale.setTo(ballScaleFactor / this.cursor.height * 0.9);


		//var latestGood = this.ball.position;
		//Input from keyboard
		this.keys = this.game.input.keyboard.createCursorKeys();

		//  Input Enable the sprites
		this.ball.inputEnabled = true;

		//  Allow dragging - the 'true' parameter will make the sprite snap to the center
		//this.ball.input.enableDrag(true);
		//console.log(this.ball.events);

		//Create player and input from device as orientation
		Ball._player = this.ball;
		//window.addEventListener("deviceorientation", this.handleOrientation, true);

		//Update game every second (only timer or everything?)
		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		//this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.border = this.game.add.graphics();
		this.border.lineStyle(8, 0x000000, 0.8);
		this.border.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT);
		this.panel = this.game.add.graphics();
		this.panel.beginFill(0x000000, 0.8);
		this.panel.drawRect(0, 0, Ball._WIDTH, Ball._HEIGHT * 0.1);
		this.borderGroup.add(this.panel);
		//this.borderGroup.setAll('body.immovable', true);
		//this.bounceSound = this.game.add.audio('audio-bounce');

		this.timerText = this.game.add.text(0.05 * Ball._WIDTH, Ball._HEIGHT * 0.05, "Time: " + this.timer, { ...Ball.fontBig, ...Ball.white });
		this.timerText.anchor.setTo(0, 0.5);
		this.timerText.scale.setTo(Ball.scaleFactor);
		this.totalCollisionsText = this.game.add.text(0.4 * Ball._WIDTH, Ball._HEIGHT * 0.05, "Collisions: " + this.totalCollisions, { ...Ball.fontBig, ...Ball.white });
		this.totalCollisionsText.anchor.setTo(0, 0.5);
		this.totalCollisionsText.scale.setTo(Ball.scaleFactor);

		//this.startButton[1].lineStyle(4, 0xffffff, 1);
		//this.startButton[1].drawRect(-Ball._WIDTH * 0.225, -Ball._HEIGHT * 0.025, Ball._WIDTH * 0.45, Ball._HEIGHT * 0.05);



		//this.ball.body.collideWorldBounds = true;
		//this.ball.body.bounce.set(0.9);
		this.onBall = false;


		this.game.input.onUp.add((e) => {
			console.log('UP');
			this.onBall = false;
			//console.log(this.onBall)
		});


		this.game.input.onTap.add(function () {
			//console.log('TAP');
			//console.log( this.onBall)
		});


		this.game.input.onDown.add((e) => {
			console.log('DOWN');

			//console.log("BALL: ", this.ball._bounds);
			//console.log("Cursor: ", this.cursor);
			this.cursor.position.x = e.x;
			this.cursor.position.y = e.y;

			//console.log("Cursor before: ", this.cursor._bounds);
			this.cursor._bounds.x = e.x;
			this.cursor._bounds.y = e.y;
			this.cursor._bounds.width = this.cursor.width;
			this.cursor._bounds.height = this.cursor.height;
			var rect1 = this.ball._bounds;
			var rect2 = this.cursor._bounds;
			//console.log("Cursor after: ", rect2, ", Ball after: ", rect1);

			this.onBall = Phaser.Rectangle.intersects(rect1, rect2);

			//console.log(this.onBall);

		});





	},
	updateCounter: function () {
		//Update the timer every second in the game
		this.timer++;
		this.timerText.setText("Time: " + this.timer);
		//this.totalTimeText.setText("Total time: "+(this.totalTimer+this.timer));
	},

	update: function () {


		//Check if the level is finished
		if (this.checkOverlap(this.ball, this.hole)) { this.finishLevel() }

		//Start by setting collision to false
		collision = false;


		//Check if the user is dragging the ball
		if (this.onBall) {

			this.cursor.position.x = this.game.input.activePointer.position.x;
			this.cursor.position.y = this.game.input.activePointer.position.y;

			//In a for loop, check all walls in the game and see if the user is colliding or overlapping with the walls.
			for (i = 0; i < this.mazeGroup.children.length; i++) {
				if (this.checkOverlap(this.cursor, this.mazeGroup.children[i])) {
					//If they overlap with at least one wall we set the collision to true.
					collision = true;
				}
			}

			if (collision) {
				//console.log('Overlapping: true');
				//If we have a collision with the ball we call the wallCollision function
				this.wallCollision(collision);
			}
			else {
				if (this.prevCollision && !collision) {
					//if go out of collision state, the position also needs to be updated
					var maxdis = (this.gridSize.x < this.gridSize.y) ? this.gridSize.x : this.gridSize.y;
					//var maxdis2 = Math.pow(this.gridSize.x,2) + Math.pow(this.gridSize.y,2);
					var cursorBallDis = Math.sqrt(Math.pow(this.cursor.position.x - this.ball.position.x, 2)
						+ Math.pow(this.cursor.position.y - this.ball.position.y, 2));
					//var cursorBallDis2 = Math.pow(this.cursor.position.x - this.ball.position.x, 2)
						+ Math.pow(this.cursor.position.y - this.ball.position.y, 2);	
					console.log(maxdis);
					console.log(cursorBallDis);
					if (cursorBallDis < maxdis) {
						this.ball.position.x = this.cursor.position.x;
						this.ball.position.y = this.cursor.position.y;
					}
				}
				else {
					//If we don't find any overlaps we add the current position of the ball in the prevPos array
					//console.log('Overlapping: false');
					if (this.checkOverlap(this.cursor, this.ball)){
						this.ball.position.x = this.cursor.position.x;
						this.ball.position.y = this.cursor.position.y;
					}
				}
			}

		}
		
		//--------------* At end *-----------------------
		this.prevCollision = collision;

	},

	checkOverlap: function (spriteA, spriteB) {
		//Check if two sprites overlap, or "collide"
		var boundsA = spriteA.getBounds();
		//console.log(boundsA);
		var boundsB = spriteB.getBounds();
		//console.log(boundsB);
		return Phaser.Rectangle.intersects(boundsA, boundsB);
	},

	wallCollision: function (collision) {
		console.log("wall collision");
		//Here we see what happens when we hit a wall.
		if (!this.prevCollision) {
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
			/*
			if (!this.bounceSound.isPlaying){
				this.bounceSound.play();
			}*/
			/*
			if ("vibrate" in window.navigator) {
				window.navigator.vibrate(100);
			}*/
		}
	},

	finishLevel: function () {
		this.game.state.start('Result');
	}
};
