//This is the actual play area of the game. You control the snake, eat foods and have lots of fun. When you die, you transition to the Game_Over state.

var snake, food, squareSize, score, speed,
    frameCounter, direction, new_direction,
    addNewTail, cursors, scoreTextValue, speedTextValue, 
    textStyle_Key, textStyle_Value;

var Game = {

    preload : function() {
        // Here we load all the needed resources for the level.
        game.load.image('snake', './assets/images/snakep.png');
        game.load.image('food', './assets/images/food.png');
        game.load.image('background', './assets/images/bg.png');
        game.load.audio('eat', './assets/images/eat.mp3');
        game.load.audio('crash', './assets/images/crash.mp3');
        game.load.audio('smack', './assets/images/smack.wav');
    },

    create : function() {
        background = game.add.image(0,0,"background");
        eatingSound = game.add.audio('eat');
        crashingSound = game.add.audio('crash');
        smackSound = game.add.audio('smack');
        

        snake = [];                    
        food = {};                     
        squareSize = 32;               
        score = 0;                    
        speed = 0;                     
        frameCounter = 0;                
        direction = 'right';            
        new_direction = null;           
        addNewTail = false;                 

        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();
        
        snake[0] = game.add.sprite(0,0,'snake');  // Parameters are (X coordinate, Y coordinate, image)
        this.generatefood();



       
        textStyle_Key = { font: "bold 14px sans-serif", fill: "white", align: "center" };//numberStyle
        textStyle_Value = { font: "bold 18px sans-serif", fill: "white", align: "center" }; //letter style

        // Score.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Speed.
        game.add.text(530, 18, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(600, 15, speed.toString(), textStyle_Value);

    },

    update: function() {
       //update function is called 60 times per second (almost)

    if (cursors.right.isDown && direction!='left')
    {
        new_direction = 'right';
    }
    else if (cursors.left.isDown && direction!='right')
    {
        new_direction = 'left';
    }
    else if (cursors.up.isDown && direction!='down')
    {
        new_direction = 'up';
    }
    else if (cursors.down.isDown && direction!='up')
    {
        new_direction = 'down';
    }

    // A formula to calculate game speed based on the score.
    //math.min returns the lowest value 
    speed = Math.min(8, Math.floor(score/3));//10
    speedTextValue.text = '' + speed;

    // Increase a counter on every update call.
    frameCounter++;

    // Do game stuff only if 
    if (frameCounter % (8 - speed) == 0) {

        var firstCell = snake[snake.length - 1],

            //removes the first item of the array
            lastCell = snake.shift(),

            //stores its x and y coordinates of the removed one to create a new tail in case it ate food
            oldLastCellx = lastCell.x,
            oldLastCelly = lastCell.y;


        // If a new direction, make it the direction of the snake 
        if(new_direction){
            direction = new_direction;
            new_direction = null;
        }

        // Change the last cell's coordinates relative to the head of the snake, according to the direction.
        if(direction == 'right'){

            lastCell.x = firstCell.x + 32;
            lastCell.y = firstCell.y;
        }
        else if(direction == 'left'){
            lastCell.x = firstCell.x - 32;
            lastCell.y = firstCell.y;
        }
        else if(direction == 'up'){
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y - 32;
        }
        else if(direction == 'down'){
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y + 32;
        }
        console.log('heads x is' + lastCell.x + " " +'heads y is' + lastCell.y );

        //pushing the last cell(with the new x,y) to the front
        snake.push(lastCell);
        firstCell = lastCell;
        
         

      // Increase length of snake if food is eaten
        if(addNewTail){
            snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
            addNewTail = false;
        }

        // Check for food collision.
        this.foodCollision();

        // Check for collision with the tail 
        this.tailCollision(firstCell);

        // Check with collision with walls
        this.boxCollision(firstCell);
    }
},


    foodCollision: function() {
    for(var i = 0; i < snake.length; i++){
        if(snake[i].x == food.x && snake[i].y == food.y){
            addNewTail = true;
            // Destroy the old food.
            food.destroy();
            // Make a new one.
            this.generatefood();
            score++;
            scoreTextValue.text = score.toString();
            eatingSound.play();

        }
    }
},

    tailCollision: function(head) {

   for(var i = 0; i < snake.length - 1; i++){
        if(snake[snake.length-1].x == snake[i].x && snake[snake.length-1].y == snake[i].y){
            
           var usefullCells =  snake.splice(i);
           if (snake.length > 0){
               for (k = 0; k < snake.length; k++){
                snake[k].destroy();
               }
           }
          snake = usefullCells;
           score = snake.length-1;
            smackSound.play();
        }
    }

},


    boxCollision: function(head) {

    if(head.x >= 640 || head.x < 0 || head.y >= 640 || head.y < 0){
        crashingSound.play();
        // If it's not in, we've hit a wall. Go to game over screen.
        game.state.start('Game_Over');

    }
},

    generatefood: function(){
        // Chose a random place on the grid. X,Y is between 0 and 608 (19*32)
        var randomX = Math.floor(Math.random() * 20 ) * squareSize,
            randomY = Math.floor(Math.random() * 20 ) * squareSize;
        food = game.add.sprite(randomX, randomY, 'food');
        
    }
};