window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var xCoord = 0;
    var yCoord = 0;
    var snakee;
    var applee; 
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;
    var timeOut;
    var particles = [];
    var appleImage = new Image();
    appleImage.src = "apple.png";  


    init();

    function Particle(position) {
        this.position = position.slice();
        this.radius = Math.random() * 5 + 2; 
        this.color = "#66ff66"; 
        this.velocity = {
            x: (Math.random() - 0.5) * 4, 
            y: (Math.random() - 0.5) * 4  
        };
        this.life = 20 + Math.random() * 10; 
        this.opacity = 1;
    
        this.update = function() {
            this.position[0] += this.velocity.x;
            this.position[1] += this.velocity.y;
            this.life -= 1;
            this.opacity = Math.max(0, this.life / 30); 
        };
    
        this.draw = function(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity; 
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(
                this.position[0],
                this.position[1],
                this.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        };
    }
    

    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "10px solid #333";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#111"; 
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas(){
        snakee.advance();
        if (snakee.checkCollision()){
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
    
                for (var i = 0; i < 20; i++) {
                    var particle = new Particle([
                        applee.position[0] * blockSize + blockSize / 2,
                        applee.position[1] * blockSize + blockSize / 2
                    ]);
                    particles.push(particle);
                }
    
                do {
                    applee.setNewPosition(); 
                } while(applee.isOnSnake(snakee));
            }
    
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawBackground();
    
            particles = particles.filter(particle => particle.life > 0);
            particles.forEach(particle => particle.update());
            particles.forEach(particle => particle.draw(ctx));
    
            drawScore();
    
            snakee.draw();
    
            applee.draw();
    
            timeOut = setTimeout(refreshCanvas, delay);
        }
    }
    
    

    function drawBackground(){
        var gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        gradient.addColorStop(0, "#1e3c72");
        gradient.addColorStop(1, "#2a5298");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score: " + score, 20, 20);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        var radius = blockSize / 2;

        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius - 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff6f61"; 
            ctx.shadowColor = "#ff6347";
            ctx.shadowBlur = 10;
            for (var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple) this.body.pop();
            else this.ateApple = false;
        };

        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;  
               default:
                    throw("invalid direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;

            for (var i = 0; i < rest.length; i++){
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }

            return wallCollision || snakeCollision;        
        };

        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
        };
    }

    function Apple(position){
        this.position = position;

        Apple.prototype.draw = function() {
            ctx.save();
        
            ctx.shadowColor = "#33cc33";
            ctx.shadowBlur = 20;      
            ctx.shadowOffsetX = 0;    
            ctx.shadowOffsetY = 0;     
        
            var x = this.position[0] * blockSize;
            var y = this.position[1] * blockSize;
            var size = blockSize; 
        
            ctx.drawImage(appleImage, x, y, size, size);
        
            ctx.restore();
        };

        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck){
            return snakeToCheck.body.some(block => block[0] === this.position[0] && block[1] === this.position[1]);
        };
    }

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37: newDirection = "left"; break;
            case 38: newDirection = "up"; break;
            case 39: newDirection = "right"; break;
            case 40: newDirection = "down"; break;
            case 32: 
                restart(); 
                return;
            default: return;
        }
        snakee.setDirection(newDirection);
    };

    function restart() {
        location.reload(); 
    }
};
