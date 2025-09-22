(() => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Elemen canvas tidak ditemukan!");
        return;
    }
    const ctx = canvas.getContext('2d');

    const hitPaddleSound = new Audio('audio/papan.mp3');
    const hitBrickSound = new Audio('audio/kotak.mp3');
    const loseLifeSound = new Audio('audio/chance.mp3');

    // --- Parameter & Variabel Game ---
    let ballRadius = 10;
    let x, y, dx, dy;

    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX;

    let isPaddleActive = false;

    let score = 0;
    let lives = 3;
    let gameOver = false;
    let gameWon = false;
    let gameStarted = false;

    let bricks = [];
    const brickRowCount = 4;
    const brickColumnCount = 6;
    const brickWidth = 65;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    // --- Inisialisasi & Reset Game ---
    function initGame() {
        score = 0;
        gameOver = false;
        gameWon = false;
        x = canvas.width / 2;
        y = canvas.height - 30;
        
        let speedMultiplier = parseFloat(document.getElementById('speedSlider').value);
        dx = speedMultiplier;
        dy = -speedMultiplier;
        
        paddleWidth = parseInt(document.getElementById('paddleSlider').value);
        paddleX = (canvas.width - paddleWidth) / 2;
        
        createBricks();
    }

    function resetGame() {
        if (gameOver || gameWon) {
            lives = 3;
            gameStarted = true;
            initGame();
            draw();
        }
    }

    function createBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    // --- Fungsi Menggambar ---
    function drawStartScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Klik untuk Mulai", canvas.width / 2, canvas.height / 2);
    }
    
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = `hsl(${c * 60}, 100%, 50%)`;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawUI() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "left";
        ctx.fillText("Score: " + score, 8, 20);
        ctx.fillText("Nyawa: " + lives, canvas.width - 75, 20);
    }

    // --- Logika Game ---
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        
                        hitBrickSound.currentTime = 0;
                        hitBrickSound.play();

                        if (score === brickRowCount * brickColumnCount) {
                            gameWon = true;
                        }
                    }
                }
            }
        }
    }

    function draw() {
        if (!gameStarted || gameOver || gameWon) {
             if (gameOver || gameWon) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "30px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                let message = gameWon ? "YOU WIN!" : "GAME OVER";
                ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
                ctx.font = "16px Arial";
                ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
                ctx.fillText("Klik untuk Main Lagi", canvas.width/2, canvas.height/2 + 40);
            }
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawUI();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                hitPaddleSound.play();
            } else {
                lives--;
                loseLifeSound.play();
                if (!lives) {
                    gameOver = true;
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    let speedMultiplier = parseFloat(document.getElementById('speedSlider').value);
                    dx = speedMultiplier;
                    dy = -speedMultiplier;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        x += dx;
        y += dy;

        requestAnimationFrame(draw);
    }
    
    // --- Event Listeners ---
    
    function handlePaddleMove(e) {
        if (isPaddleActive) {
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;

            let clientX = e.clientX || e.touches[0].clientX;
            let canvasX = (clientX - rect.left) * scaleX;

            paddleX = canvasX - paddleWidth / 2;

            if (paddleX < 0) {
                paddleX = 0;
            }
            if (paddleX + paddleWidth > canvas.width) {
                paddleX = canvas.width - paddleWidth;
            }
        }
    }
    
    // BARU: Fungsi khusus untuk menangani logika mulai dan restart
    function handleStartOrReset() {
        if (!gameStarted) {
            gameStarted = true;
            initGame();
            draw();
        } else if (gameOver || gameWon) {
            resetGame();
        }
    }

    canvas.addEventListener("mousedown", () => isPaddleActive = true);
    canvas.addEventListener("mouseup", () => isPaddleActive = false);
    canvas.addEventListener("mouseleave", () => isPaddleActive = false);
    canvas.addEventListener("mousemove", handlePaddleMove);

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        isPaddleActive = true;
        handlePaddleMove(e);
    });

    // MODIFIKASI: touchend juga memanggil logika start/reset
    canvas.addEventListener("touchend", () => {
        isPaddleActive = false;
        handleStartOrReset(); // Memanggil fungsi start/reset
    });

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        handlePaddleMove(e);
    });

    document.getElementById('speedSlider').addEventListener('input', (e) => {
        let speedMultiplier = parseFloat(e.target.value);
        let currentSpeed = Math.sqrt(dx*dx + dy*dy);
        if (currentSpeed > 0) {
           dx = (dx / currentSpeed) * speedMultiplier;
           dy = (dy / currentSpeed) * speedMultiplier;
        }
    });

    document.getElementById('paddleSlider').addEventListener('input', (e) => {
        paddleWidth = parseInt(e.target.value);
    });
    
    // MODIFIKASI: click sekarang memanggil fungsi yang sama dengan touchend
    canvas.addEventListener("click", handleStartOrReset);

    drawStartScreen();
})();