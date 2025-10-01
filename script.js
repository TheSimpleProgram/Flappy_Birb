document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const endScreen = document.getElementById('end-screen');
    const homeScreen = document.getElementById('home-screen');
    const birdSelect = document.getElementById('bird-select');
    const startButton = document.getElementById('start-button');
    const finalScoreElem = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const instructions = document.getElementById('instructions');
    const birdPreviewCanvas = document.querySelector('.bird-option[data-bird="default"] .bird-preview');


    const previewCtx = birdPreviewCanvas.getContext('2d');
    previewCtx.fillStyle = 'yellow';
    previewCtx.beginPath();
    previewCtx.arc(20, 20, 18, 0, Math.PI * 2);
    previewCtx.fill();
    previewCtx.fillStyle = 'black';
    previewCtx.beginPath();
    previewCtx.arc(25, 15, 3, 0, Math.PI * 2);
    previewCtx.fill();

   
    let selectedBird = 'default'; 
    let birdImg = new Image();
    birdImg.src = 'https://static.wikia.nocookie.net/angrybirds/images/f/fa/TerenceABClassic.png/revision/latest?cb=20250203201739'; 


    let birdX = 50, birdY = 250, birdVelocity = 0;
    const gravity = 0.25, jumpStrength = -6;
    let pipes = [], frameCount = 0, score = 0;
    const pipeWidth = 60, pipeGap = 180, pipeSpeed = 1.5;
    let isGameOver = true;
    let isGameStarted = false;

    function drawBird() {
        if (selectedBird === 'default') {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(birdX, birdY, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(birdX + 5, birdY - 5, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (selectedBird === 'image') {
            ctx.save();
            ctx.beginPath();
            ctx.arc(birdX, birdY, 22, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(birdImg, birdX - 22, birdY - 22, 44, 44);
            ctx.restore();
        }
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
            if (
                birdX + 20 > pipe.x &&
                birdX - 20 < pipe.x + pipeWidth &&
                (birdY - 20 < pipe.topHeight || birdY + 20 > pipe.topHeight + pipeGap)
            ) {
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
        isGameStarted = false;
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
        isGameStarted = true;
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

 
    birdSelect.addEventListener('click', (e) => {
        let option = e.target.closest('.bird-option');
        if (!option) return;
    
        document.querySelectorAll('.bird-option').forEach(div => div.classList.remove('selected'));
        option.classList.add('selected');
        selectedBird = option.getAttribute('data-bird');
 
        drawInitialScreen();
    });


    startButton.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        drawInitialScreen();
        instructions.style.display = 'block';
        isGameOver = true;
    });


    restartButton.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        isGameStarted = false;
        drawInitialScreen();
    });

    
    document.addEventListener('keydown', (e) => {
        if (homeScreen.classList.contains('hidden')) {
            if (e.code === 'Space') {
                if (isGameOver && !isGameStarted) {
                    startGame();
                    birdVelocity = jumpStrength;
                } else if (!isGameOver) {
                    birdVelocity = jumpStrength;
                }
            }
        }
    });

   
    homeScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    drawInitialScreen();
});
