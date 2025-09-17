(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');

    let playerY = 150, playerVY = 0;
    let obstacles = [];
    let frame = 0;
    let score = 0;

    const jump = () => {
        if (playerY >= 150) playerVY = -10;
    };

    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowUp') jump();
    });

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Player
        playerVY += 0.5; // gravity
        playerY += playerVY;
        if (playerY > 150) playerY = 150, playerVY = 0;
        ctx.fillStyle = 'green';
        ctx.fillRect(50, playerY, 20, 20);

        // Obstacles
        if (frame % 90 === 0) obstacles.push({x: 600, width: 20, height: 20});
        obstacles.forEach(obs => {
            obs.x -= 5;
            ctx.fillStyle = 'red';
            ctx.fillRect(obs.x, 150, obs.width, obs.height);

            // Collision
            if (obs.x < 70 && obs.x + obs.width > 50 && playerY + 20 > 150) {
                alert('Game Over! Score: ' + score);
                obstacles = [];
                score = 0;
            }
        });
        obstacles = obstacles.filter(o => o.x + o.width > 0);

        // Score
        score++;
        scoreEl.textContent = score;

        frame++;
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
})();
