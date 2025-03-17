const gameArea = document.getElementById("gameArea");
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
let ballX = 390, ballY = 290, ballDX = 4, ballDY = -4;
let paddleX = 350, paddleSpeed = 7;
let rightPressed = false, leftPressed = false;
let blocks = [], bonuses = [], score = 0;

// Создаем блоки
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
        let block = document.createElement("div");
        block.className = "block";
        block.style.left = `${col * 80 + 5}px`;
        block.style.top = `${row * 30 + 30}px`;
        gameArea.appendChild(block);
        blocks.push(block);
    }
}

function moveBall() {
    ballX += ballDX;
    ballY += ballDY;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    if (ballX <= 0 || ballX >= 780) ballDX *= -1;
    if (ballY <= 0) ballDY *= -1;
    if (ballY >= 580) location.reload();

    if (ballY + 20 >= 590 && ballX >= paddleX && ballX <= paddleX + 100) {
        ballDY *= -1;
    }
}

function movePaddle() {
    if (rightPressed && paddleX < 700) paddleX += paddleSpeed;
    if (leftPressed && paddleX > 0) paddleX -= paddleSpeed;
    paddle.style.left = `${paddleX}px`;
}

function checkBlockCollision() {
    blocks.forEach((block, index) => {
        if (block && ballX + 20 >= block.offsetLeft && ballX <= block.offsetLeft + 75 && ballY + 20 >= block.offsetTop && ballY <= block.offsetTop + 25) {
            ballDY *= -1;
            block.remove();
            blocks.splice(index, 1);
            score++;
        }
    });
}

function gameLoop() {
    moveBall();
    movePaddle();
    checkBlockCollision();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") rightPressed = true;
    if (e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowLeft") leftPressed = false;
});

gameLoop();