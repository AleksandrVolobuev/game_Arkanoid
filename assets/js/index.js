/*игра Arkanoid 
функция которая задает траекторию мяча
функция которая задает управление  к лево в право платформы которая отбивает мячик и увеличивает счет 
фунция отрисовки платформы и мячика 
функция счетчика уничтожения блоков
функция отрисовки бонусов выпадающих с бловов по направлению платформы
*/
         // Получаем ссылку на canvas и его контекст рисования
         const canvas = document.getElementById("gameCanvas");
         const ctx = canvas.getContext("2d");
 
         // Создаем объект мяча
         let ball = { x: 400, y: 300, radius: 10, dx: 4, dy: -4 };
         
         // Создаем объект платформы
         let paddle = { x: 350, y: 580, width: 100, height: 10, speed: 7 };
         
         // Флаги нажатия клавиш
         let rightPressed = false, leftPressed = false;
         
         // Массив для блоков
         let blocks = [];
         
         // Массив для бонусов
         let bonuses = [];
         
         // Переменная для хранения счета
         let score = 0;
 
         // Генерируем блоки
         for (let row = 0; row < 5; row++) {
             for (let col = 0; col < 10; col++) {
                 blocks.push({ x: col * 80 + 5, y: row * 30 + 30, width: 75, height: 25, destroyed: false });
             }
         }
 
         // Функция отрисовки мяча
         function drawBall() {
             ctx.beginPath();
             ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
             ctx.fillStyle = "#ff0";
             ctx.fill();
             ctx.closePath();
         }
 
         // Функция отрисовки платформы
         function drawPaddle() {
             ctx.fillStyle = "#0f0";
             ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
         }
 
         // Функция отрисовки блоков
         function drawBlocks() {
             ctx.fillStyle = "#f00";
             blocks.forEach(block => {
                 if (!block.destroyed) {
                     ctx.fillRect(block.x, block.y, block.width, block.height);
                 }
             });
         }
 
         // Функция отрисовки бонусов
         function drawBonuses() {
             ctx.fillStyle = "blue";
             bonuses.forEach(bonus => {
                 ctx.fillRect(bonus.x, bonus.y, 15, 15);
             });
         }
 
         // Функция движения мяча
         function moveBall() {
             ball.x += ball.dx;
             ball.y += ball.dy;
 
             // Проверка столкновения со стенками
             if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                 ball.dx *= -1;
             }
             if (ball.y - ball.radius < 0) {
                 ball.dy *= -1;
             }
             if (ball.y + ball.radius > canvas.height) {
                 document.location.reload(); // Перезапуск игры при падении мяча
             }
 
             // Проверка столкновения с платформой
             if (
                 ball.y + ball.radius >= paddle.y &&
                 ball.x >= paddle.x && ball.x <= paddle.x + paddle.width
             ) {
                 ball.dy *= -1;
             }
         }
 
         // Функция движения платформы
         function movePaddle() {
             if (rightPressed && paddle.x + paddle.width < canvas.width) {
                 paddle.x += paddle.speed;
             }
             if (leftPressed && paddle.x > 0) {
                 paddle.x -= paddle.speed;
             }
         }
 
         // Функция проверки столкновений мяча с блоками
         function checkBlockCollision() {
             blocks.forEach(block => {
                 if (!block.destroyed && ball.x >= block.x && ball.x <= block.x + block.width && ball.y - ball.radius <= block.y + block.height && ball.y + ball.radius >= block.y) {
                     ball.dy *= -1;
                     block.destroyed = true;
                     score++;
                     
                     // Вероятность выпадения бонуса
                     if (Math.random() < 0.3) {
                         bonuses.push({ x: block.x + block.width / 2, y: block.y + block.height, dy: 2 });
                     }
                 }
             });
         }
 
         // Функция движения бонусов
         function moveBonuses() {
             bonuses.forEach((bonus, index) => {
                 bonus.y += bonus.dy;
                 
                 // Проверка столкновения бонуса с платформой
                 if (bonus.y + 15 > paddle.y && bonus.x >= paddle.x && bonus.x <= paddle.x + paddle.width) {
                     paddle.width += 20; // Увеличение платформы
                     bonuses.splice(index, 1);
                 }
             });
         }
 
         // Функция отображения счета
         function drawScore() {
             ctx.fillStyle = "#fff";
             ctx.font = "20px Arial";
             ctx.fillText("Очки: " + score, 10, 20);
         }
 
         // Основной игровой цикл
         function gameLoop() {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             drawBall();
             drawPaddle();
             drawBlocks();
             drawBonuses();
             drawScore();
             moveBall();
             movePaddle();
             checkBlockCollision();
             moveBonuses();
             requestAnimationFrame(gameLoop);
         }
 
         // Обработчики событий клавиатуры
         document.addEventListener("keydown", (e) => {
             if (e.key === "ArrowRight") rightPressed = true;
             if (e.key === "ArrowLeft") leftPressed = true;
         });
 
         document.addEventListener("keyup", (e) => {
             if (e.key === "ArrowRight") rightPressed = false;
             if (e.key === "ArrowLeft") leftPressed = false;
         });
 
         // Запуск игрового цикла
         gameLoop();