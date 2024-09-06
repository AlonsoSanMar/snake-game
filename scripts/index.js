let gameCanvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let speed = 100;
let dx = 10;
let dy = 0;
let changingDirection;

let score = 0;
let snake = [
    { x: 110, y: 150 }, 
    { x: 100, y: 150 }, 
    { x: 90, y: 150 }, 
    { x: 80, y: 150 }, 
    { x: 70, y: 150 },
];
let foodX;
let foodY;

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "lightgreen";
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        if(speed >= 50){
            speed -= 5;
        }
        console.log(speed)
        createFood();
    } else {
        snake.pop();
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) {
            createFood();
        }
    }
    );
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) {
        return true;
    }

    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10; dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0; dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10; dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0; dy = 10;
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (didCollide) return true
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function resetGame() {
    snake = [  
        { x: 110, y: 150 }, 
        { x: 100, y: 150 }, 
        { x: 90, y: 150 }, 
        { x: 80, y: 150 }, 
        { x: 70, y: 150 }
    ];
    dx = 10;
    dy = 0;
    changingDirection = false;
    speed = 100;
    score = 0;
    document.getElementById('score').innerHTML = score;
}


function main() {
    if (didGameEnd()) {
        document.getElementById('display').style.display = 'none';
        document.getElementById('jugar').style.display ='block';
        return;
    }
    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, speed)
}



document.getElementById('jugar').addEventListener('click', () => {
    document.getElementById('display').style.display = 'block';
    document.getElementById('jugar').style.display ='none';
    resetGame();
    createFood();
    main();
})
document.addEventListener("keydown", changeDirection);