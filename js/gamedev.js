(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const jumpBtn = document.getElementById("jumpBtn");

    let isRunning = false;
    let animationFrame;
    let obstacles = [];
    let frameCount = 0;
    let score = 0;

    const player = {
        x: 50,
        y: 130,
        width: 20,
        height: 20,
        color: "blue",
        velocityY: 0,
        gravity: 0.5,
        jumpPower: -8,
        isJumping: false
    };

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function spawnObstacle() {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 20,
            width: 20,
            height: 20,
            color: "red",
            speed: 3
        });
    }

    function drawObstacles() {
        obstacles.forEach(obs => {
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    function updateObstacles() {
        obstacles.forEach(obs => {
            obs.x -= obs.speed;
        });
        obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    }

    function checkCollision() {
        for (let obs of obstacles) {
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                isRunning = false;
                cancelAnimationFrame(animationFrame);
                alert(`Game Over! Score: ${score}`);
                return true;
            }
        }
        return false;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gravity + floor
        player.y += player.velocityY;
        if (player.y + player.height < canvas.height) {
            player.velocityY += player.gravity;
        } else {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }

        // Obstacles
        if (frameCount % 100 === 0) {
            spawnObstacle();
        }
        updateObstacles();

        // Draw
        drawPlayer();
        drawObstacles();

        // Score
        score++;
        ctx.fillStyle = "black";
        ctx.font = "14px monospace";
        ctx.fillText(`Score: ${score}`, 10, 20);

        // Collision
        if (!checkCollision() && isRunning) {
            frameCount++;
            animationFrame = requestAnimationFrame(update);
        }
    }

    function jump() {
        if (!player.isJumping) {
            player.velocityY = player.jumpPower;
            player.isJumping = true;
        }
    }

    playBtn.addEventListener("click", () => {
        if (!isRunning) {
            // Reset game
            isRunning = true;
            obstacles = [];
            frameCount = 0;
            score = 0;
            player.y = canvas.height - player.height;
            update();
        }
    });

    stopBtn.addEventListener("click", () => {
        isRunning = false;
        cancelAnimationFrame(animationFrame);
    });

    jumpBtn.addEventListener("click", jump);
})();
