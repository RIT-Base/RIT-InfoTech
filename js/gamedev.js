(() => {
    const canvas = document.getElementById('gameCanvas');
    // Jika skrip dijalankan sebelum canvas ada, tunggu dan coba lagi.
    if (!canvas) {
        setTimeout(arguments.callee, 100);
        return;
    }
    const ctx = canvas.getContext('2d');

    const hitPaddleSound = new Audio('audio/papan.mp3');
    const hitBrickSound = new Audio('audio/kotak.mp3');
    const loseLifeSound = new Audio('audio/chance.mp3');

    // --- Variabel Game ---
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
    
    // --- Variabel Kontrol Status ---
    let isPaused = false;
    let ignoreNextInput = false;

    let bricks = [];
    const brickRowCount = 4;
    const brickColumnCount = 6;
    const brickWidth = 65;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    // --- Inisialisasi & Reset ---
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
            requestAnimationFrame(draw);
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
    
    function drawBall() { ctx.beginPath(); ctx.arc(x, y, ballRadius, 0, Math.PI * 2); ctx.fillStyle = "#0095DD"; ctx.fill(); ctx.closePath(); }
    function drawPaddle() { ctx.beginPath(); ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); ctx.fillStyle = "#0095DD"; ctx.fill(); ctx.closePath(); }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX; bricks[c][r].y = brickY;
                    ctx.beginPath(); ctx.rect(brickX, brickY, brickWidth, brickHeight); ctx.fillStyle = `hsl(${c * 60}, 100%, 50%)`; ctx.fill(); ctx.closePath();
                }
            }
        }
    }

    function drawUI() { ctx.font = "16px Arial"; ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.fillText("Score: " + score, 8, 20); ctx.fillText("Nyawa: " + lives, canvas.width - 75, 20); }

    // --- Logika Game ---
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; b.status = 0; score++;
                    hitBrickSound.currentTime = 0; hitBrickSound.play();
                    if (score === brickRowCount * brickColumnCount) { gameWon = true; ignoreNextInput = true; }
                }
            }
        }
    }

    function draw() {
        if (isPaused || !gameStarted || gameOver || gameWon) {
             if (gameOver || gameWon) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "30px Arial"; ctx.fillStyle = "white"; ctx.textAlign = "center";
                let message = gameWon ? "YOU WIN!" : "GAME OVER";
                ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
                ctx.font = "16px Arial";
                ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
                ctx.fillText("Klik untuk Main Lagi", canvas.width/2, canvas.height/2 + 40);
            }
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks(); drawBall(); drawPaddle(); drawUI(); collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) { dx = -dx; }
        if (y + dy < ballRadius) { dy = -dy; }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                 // 1. Hitung titik tumbukan relatif dari tengah papan (-1 untuk paling kiri, 0 untuk tengah, 1 untuk paling kanan)
                let collidePoint = x - (paddleX + paddleWidth / 2);
                let normalizedCollidePoint = collidePoint / (paddleWidth / 2);

                // 2. Tentukan sudut pantulan. Semakin jauh dari tengah, semakin tajam sudutnya.
                // Di sini kita batasi sudut maksimalnya sekitar 60 derajat (Math.PI / 3).
                let bounceAngle = normalizedCollidePoint * (Math.PI / 3);

                // 3. Dapatkan kecepatan total bola dari slider
                let speed = parseFloat(document.getElementById('speedSlider').value);

                // 4. Hitung kecepatan horizontal (dx) dan vertikal (dy) baru menggunakan trigonometri
                // agar total kecepatan bola tetap konsisten.
                dx = speed * Math.sin(bounceAngle);
                dy = -speed * Math.cos(bounceAngle); // dy harus selalu negatif (ke atas)

                hitPaddleSound.play();
             }
            else {
                lives--; loseLifeSound.play();
                if (!lives) { gameOver = true; ignoreNextInput = true; }
                else {
                    x = canvas.width / 2; y = canvas.height - 30;
                    let speed = parseFloat(document.getElementById('speedSlider').value);
                    dx = speed; dy = -speed;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        x += dx; y += dy;
        requestAnimationFrame(draw);
    }
    
    // --- Event Listeners & Kontrol ---
    function handlePaddleMove(e) {
        if (isPaddleActive) {
            let rect = canvas.getBoundingClientRect(); let scaleX = canvas.width / rect.width;
            let clientX = e.clientX || e.touches[0].clientX;
            let canvasX = (clientX - rect.left) * scaleX;
            paddleX = canvasX - paddleWidth / 2;
            if (paddleX < 0) paddleX = 0;
            if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
        }
    }
    
    function handleStartOrReset() {
        if (ignoreNextInput) { ignoreNextInput = false; return; }
        if (!gameStarted) { gameStarted = true; initGame(); requestAnimationFrame(draw); }
        else if (gameOver || gameWon) { resetGame(); }
    }

    // --- PERBAIKAN: Menggunakan Intersection Observer ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Elemen terlihat, lanjutkan game
                isPaused = false;
                requestAnimationFrame(draw); // Lanjutkan loop animasi
            } else {
                // Elemen tidak terlihat, jeda game
                isPaused = true;
            }
        });
    }, { threshold: 0.1 }); // threshold 0.1 berarti >10% elemen harus terlihat

    observer.observe(canvas);
    // --- AKHIR PERBAIKAN ---

    canvas.addEventListener("mousedown", () => isPaddleActive = true);
    canvas.addEventListener("mouseup", () => isPaddleActive = false);
    canvas.addEventListener("mouseleave", () => isPaddleActive = false);
    canvas.addEventListener("mousemove", handlePaddleMove);
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); isPaddleActive = true; handlePaddleMove(e); });
    canvas.addEventListener("touchend", () => { isPaddleActive = false; handleStartOrReset(); });
    canvas.addEventListener("touchmove", (e) => { e.preventDefault(); handlePaddleMove(e); });
    canvas.addEventListener("click", handleStartOrReset);

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

    drawStartScreen();
})();