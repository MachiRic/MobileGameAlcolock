# MobileGameAlcolock
This is a prototype made in a course at KTH, of a mobile game that eventually could replace the product called Alcolock. 

To run the game locally, download [node.js](https://www.npmjs.com/package/http-server).
After that, open your preferred command tool and go to your local directory for this repository and run:
```node app.js```

Then open your preferred browser and type: `http://127.0.0.1:8000/index.html`

<!--You also need Phaser to run the project. [Here](http://phaser.io/download/stable) is a guide to download Phaser.-->

#### Important files

[Index.html](index.html): This is the file that run and show all the other files that contain the app. This is where we switch between screens etc.

[Game](src/Game.js): This file is where we write the code for the actual game and gameplay. This is where the magic happens and where we will do the most coding.

[Preloader](src/Preloader.js): In this file we preload all the images and audio files that we will use in the app.

