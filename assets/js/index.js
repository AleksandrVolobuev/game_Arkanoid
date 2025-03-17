// Получаем игровые элементы из HTML
const gameArea = document.getElementById("gameArea");
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");

// Начальные координаты мяча
let ballX = 390, ballY = 290;
// Начальные скорости мяча по осям X и Y
let ballDX = 4, ballDY = -4;

// Начальная координата платформы и скорость её движения
let paddleX = 350, paddleSpeed = 7;

// Флаги для отслеживания нажатия клавиш управления платформой
let rightPressed = false, leftPressed = false;

// Массивы для хранения блоков и бонусов
let blocks = [], bonuses = [];
// Очки игрока
let score = 0;

// Создание блоков для игры (5 строк, 10 колонок)
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
        let block = document.createElement("div"); // Создаём новый элемент блока
        block.className = "block"; // Присваиваем класс для стилизации
        // Устанавливаем позицию блока
        block.style.left = `${col * 80 + 5}px`;
        block.style.top = `${row * 30 + 30}px`;
        gameArea.appendChild(block); // Добавляем блок в игровую область
        blocks.push(block); // Сохраняем блок в массив
    }
}

// Функция движения мяча
function moveBall() {
    ballX += ballDX; // Изменяем координату X мяча
    ballY += ballDY; // Изменяем координату Y мяча
    ball.style.left = `${ballX}px`; // Обновляем положение мяча на странице
    ball.style.top = `${ballY}px`;

    // Отражение мяча от левой и правой границы
    if (ballX <= 0 || ballX >= 780) ballDX *= -1;
    // Отражение мяча от верхней границы
    if (ballY <= 0) ballDY *= -1;
    // Если мяч падает ниже игровой зоны, перезапускаем игру
    if (ballY >= 580) location.reload();

    // Проверка столкновения мяча с платформой
    if (ballY + 20 >= 590 && ballX >= paddleX && ballX <= paddleX + 100) {
        ballDY *= -1; // Меняем направление движения мяча по Y
    }
}

// Функция движения платформы
function movePaddle() {
    if (rightPressed && paddleX < 700) paddleX += paddleSpeed; // Двигаем вправо, если не достигли края
    if (leftPressed && paddleX > 0) paddleX -= paddleSpeed; // Двигаем влево, если не достигли края
    paddle.style.left = `${paddleX}px`; // Обновляем положение платформы
}

// Функция проверки столкновения мяча с блоками
function checkBlockCollision() {
    blocks.forEach((block, index) => {
        // Проверяем, столкнулся ли мяч с блоком
        if (block && ballX + 20 >= block.offsetLeft && ballX <= block.offsetLeft + 75 &&
            ballY + 20 >= block.offsetTop && ballY <= block.offsetTop + 25) {
            ballDY *= -1; // Меняем направление движения мяча по Y
            block.remove(); // Удаляем блок из DOM
            blocks.splice(index, 1); // Удаляем блок из массива
            score++; // Увеличиваем счёт
        }
    });
}

// Основной игровой цикл
function gameLoop() {
    moveBall(); // Двигаем мяч
    movePaddle(); // Двигаем платформу
    checkBlockCollision(); // Проверяем столкновения
    requestAnimationFrame(gameLoop); // Запускаем следующий кадр игры
}

// Обработчик нажатия клавиш
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") rightPressed = true; // Вправо
    if (e.key === "ArrowLeft") leftPressed = true; // Влево
});

// Обработчик отпускания клавиш
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowLeft") leftPressed = false;
});

// Запускаем игру
gameLoop();
