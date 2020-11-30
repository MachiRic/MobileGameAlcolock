Ball.Howto = function (game) {
};
/*
Ball.Howto.prototype = {
    create: function() {
        //Change 'screen-howtoplay' to another png
        this.buttonContinue = this.add.button(0, 0, 'screen-howtoplay', this.startGame, this);
    },
    startGame: function() {
        this.game.state.start('Game');
    }
};*/

//test maze generation process
//reference: https://www.emanueleferonato.com/2015/06/30/pure-javascript-perfect-tile-maze-generation-with-a-bit-of-magic-thanks-to-phaser/
Ball.Howto.prototype = {
    create: function () {
        this.stage.backgroundColor = "#fffff1";
        this.maze = [];
        this.mazeWidth = 21;
        this.mazeHeight = 41;
        console.log(Ball._WIDTH/this.mazeWidth);
        this.tileWidth = Ball._WIDTH/this.mazeWidth;
        this.tileHeight = Ball._HEIGHT/this.mazeHeight;

        this.mazeGraphics = this.game.add.graphics(0, 0);
        var moves = [];
        for (var i = 0; i < this.mazeHeight; i++) {
            this.maze[i] = [];
            for (var j = 0; j < this.mazeWidth; j++) {
                this.maze[i][j] = 1;
            }
        }
        var posX = 1;
        var posY = 1;
        this.maze[posX][posY] = 0;
        moves.push(posY + posY * this.mazeWidth);
        while (moves.length){
            var possibleDirections = "";
                if (posX + 2 > 0 && posX + 2 < this.mazeHeight - 1 && this.maze[posX + 2][posY] == 1) {
                    possibleDirections += "S";
                }
                if (posX - 2 > 0 && posX - 2 < this.mazeHeight - 1 && this.maze[posX - 2][posY] == 1) {
                    possibleDirections += "N";
                }
                if (posY - 2 > 0 && posY - 2 < this.mazeWidth - 1 && this.maze[posX][posY - 2] == 1) {
                    possibleDirections += "W";
                }
                if (posY + 2 > 0 && posY + 2 < this.mazeWidth - 1 && this.maze[posX][posY + 2] == 1) {
                    possibleDirections += "E";
                }
                if (possibleDirections) {
                    var move = this.game.rnd.between(0, possibleDirections.length - 1);
                    switch (possibleDirections[move]) {
                        case "N":
                            this.maze[posX - 2][posY] = 0;
                            this.maze[posX - 1][posY] = 0;
                            posX -= 2;
                            break;
                        case "S":
                            this.maze[posX + 2][posY] = 0;
                            this.maze[posX + 1][posY] = 0;
                            posX += 2;
                            break;
                        case "W":
                            this.maze[posX][posY - 2] = 0;
                            this.maze[posX][posY - 1] = 0;
                            posY -= 2;
                            break;
                        case "E":
                            this.maze[posX][posY + 2] = 0;
                            this.maze[posX][posY + 1] = 0;
                            posY += 2;
                            break;
                    }
                    moves.push(posY + posX * this.mazeWidth);
                }
                else {
                    var back = moves.pop();
                    posX = Math.floor(back / this.mazeWidth);
                    posY = back % this.mazeWidth;
                }
        }
        this.drawMaze();
    },
    drawMaze: function () {
        
        this.mazeGraphics.clear();
        this.mazeGraphics.beginFill(0x000000);
        for (i = 0; i < this.mazeHeight; i++) {
            for (j = 0; j < this.mazeWidth; j++) {
                if (this.maze[i][j] == 1) {
                    this.mazeGraphics.drawRect(j * this.tileWidth, i * this.tileHeight, this.tileWidth, this.tileHeight);
                }
            }
        }
        
        this.mazeGraphics.endFill();
    }
};