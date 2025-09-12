document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const endScreen = document.getElementById('end-screen');
    const finalScoreElem = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const instructions = document.getElementById('instructions');

    let birdX = 50, birdY = 250, birdVelocity = 0;
    const gravity = 0.25, jumpStrength = -6;

    let pipes = [], frameCount = 0, score = 0;
    const pipeWidth = 60, pipeGap = 180, pipeSpeed = 1.5;
    
    let isGameOver = true;

    function drawBird() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(birdX, birdY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(birdX + 5, birdY - 5, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawPipes() {
        ctx.strokeStyle = '#000';
        pipes.forEach(pipe => {
            const topPipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
            topPipeGradient.addColorStop(0, '#556B2F');
            topPipeGradient.addColorStop(1, '#6B8E23');
            ctx.fillStyle = topPipeGradient;
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);
            ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
            ctx.strokeRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
        });
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 24);
    }

    function update() {
        if (isGameOver) return;
        birdVelocity += gravity;
        birdY += birdVelocity;

        if (birdY + 20 > canvas.height || birdY - 20 < 0) gameOver();

        if (frameCount % 150 === 0) {
            const topHeight = Math.random() * (canvas.height - pipeGap - 150) + 75;
            pipes.push({ x: canvas.width, topHeight, scored: false });
        }

        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;
            if (birdX + 20 > pipe.x && birdX - 20 < pipe.x + pipeWidth && (birdY - 20 < pipe.topHeight || birdY + 20 > pipe.topHeight + pipeGap)) {
                gameOver();
            }
            if (pipe.x + pipeWidth < birdX && !pipe.scored) {
                score++;
                pipe.scored = true;
            }
        });

        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
        frameCount++;
    }
    
    function gameLoop() {
        if (isGameOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPipes();
        drawBird();
        drawScore();
        update();
        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        isGameOver = true;
        finalScoreElem.textContent = score;
        endScreen.classList.remove('hidden');
        instructions.style.display = 'none';
    }

    function startGame() {
        birdY = 250;
        birdVelocity = 0;
        pipes = [];
        score = 0;
        frameCount = 0;
        isGameOver = false;
        endScreen.classList.add('hidden');
        instructions.style.display = 'none';
        gameLoop();
    }
    
    function drawInitialScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawScore();
        instructions.style.display = 'block';
    }

    // --- CORRECTED EVENT LISTENERS ---
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (isGameOver) {
                // If the game is over, this key press should start a new game.
                startGame();
                // And immediately apply the first jump.
                birdVelocity = jumpStrength;
            } else {
                // If the game is already running, just jump.
                birdVelocity = jumpStrength;
            }
        }
    });

    // The button click just resets the game. The player will press space to make the first jump.
    restartButton.addEventListener('click', startGame);
    
    // Initial setup
    drawInitialScreen();
});
