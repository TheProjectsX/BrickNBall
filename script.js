// Const Variables
const notice = document.getElementById("notice");

const lives = document.getElementById("lives");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");
const gameBoard = document.querySelector(".gameBoard");

const ball = document.getElementById("ball");
const userPlate = document.getElementById("userPlate");

const leftController = document.getElementById("leftController");
const rightController = document.getElementById("rightController");
const startGame = document.getElementById("startGame");

// Audios
const ballHitAudio = new Audio("audio/ballHit.wav");
const pointAudio = new Audio("audio/point.wav");
const gameOverAudio = new Audio("audio/gameOver.wav");
const gameVictoryAudio = new Audio("audio/gameVictory.wav");


// Script Helper Variales
const heightLimit = 18;
const widthtLimit = 20;

let ballInX, ballInY, velocityX, velocityY, userPlatePosition, bricksPositions, bricksInX, bricksInY, bricksGapX, bricksGapY, brickWidth, bricksAmount, currentScore, currentHighScore, gameSpeed, gameInterval;


let currentLives = 3;
let level = 0;
let plateMovementUnit = 2;

function setupGame() {
    ballInX = 17;
    ballInY = 10;

    velocityX = -1;
    velocityY = 0;

    userPlatePosition = [9, 13];
    bricksPositions = [];

    brickWidth = 2;
    bricksInX = 3 + level;
    bricksInY = 7;

    bricksGapX = 3;
    if (level > 2) {
        bricksGapX = 2;
    } else if (level > 3) {
        bricksGapX = 1;
    }

    bricksGapY = Math.floor((widthtLimit - (bricksInY * brickWidth)) / 2);
    bricksAmount = bricksInX * bricksInY;

    lives.innerText = "0" + currentLives;

    gameSpeed = 100;
    if (window.screen.width <= 500) {
        gameSpeed = 150;
    }

    gameSpeed -= level * 10;

    gameInterval = null;

    startGame.innerText = "■";
    resetPositions();
}

// Show Level notice
function showLevel() {
    notice.innerText = `Level: ${level + 1}`
    notice.style.display = "block";

    setTimeout(() => {
        notice.style.display = "none";
    }, 2000);
}

// Set Score - All in One function
function setScoreBoard() {
    if (currentScore == null) {
        currentScore = 0;
        currentHighScore = 0;
    } else {
        currentScore += 10;
    }

    if (currentHighScore == 0) {
        currentHighScore = Number.parseInt(localStorage.getItem("brickNBallHighScore"));
        if (isNaN(currentHighScore)) {
            localStorage.setItem("highScore", 0);
            currentHighScore = 0;
        }
    }

    if (currentScore > currentHighScore) {
        currentHighScore += 10;
        localStorage.setItem("brickNBallHighScore", currentHighScore);
    }

    score.innerText = currentScore.toString().length < 2 ? "0" + currentScore : currentScore;
    highScore.innerText = currentHighScore.toString().length < 2 ? "0" + currentHighScore : currentHighScore;
}

// Reset all positions of the game items
function resetPositions(only) {
    if (only) {
        ballInX = 17;
        ballInY = 11;

        velocityX = -1;
        velocityY = 0;

        userPlatePosition = [10, 14];
    }

    ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
    userPlate.style.gridColumn = `${userPlatePosition[0]} / ${userPlatePosition[1]}`

    if (!(only == true)) {
        setRandomBricks();
    }
}

// Set random bricks
function setRandomBricks() {
    let brickId = 0;
    for (let i = 0; i < bricksInX; i++) {
        let YGap = bricksGapY + 1;
        for (let j = 0; j < bricksInY; j++) {
            let newBrick = document.createElement("div");
            newBrick.classList.add("brick");
            newBrick.dataset.brickid = brickId;
            newBrick.style.gridArea = `${bricksGapX + 1} / 1 / auto / auto`;
            newBrick.style.gridColumn = `${YGap} / ${YGap + brickWidth}`

            gameBoard.appendChild(newBrick);
            bricksPositions.push([YGap, YGap + brickWidth, bricksGapX + 1]);

            YGap += brickWidth;
            brickId += 1;
        }
        bricksGapX += 1;
    }
}

// Functions to cotroll game
function ArrowLeft() {
    if (userPlatePosition[0] == 1) {
        return
    } else if (userPlatePosition[0] - 1 == 1) {
        userPlatePosition[0] -= 1;
        userPlatePosition[1] -= 1;

        if (gameInterval == null) {
            ballInY -= 1;
        }
    } else {
        userPlatePosition[0] -= plateMovementUnit;
        userPlatePosition[1] -= plateMovementUnit;

        if (gameInterval == null) {
            ballInY -= plateMovementUnit;
        }
    }

    userPlate.style.gridColumn = `${userPlatePosition[0]} / ${userPlatePosition[1]}`
    if (gameInterval == null) {
        ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
    }
}

function ArrowRight() {
    if (userPlatePosition[1] == widthtLimit) {
        userPlatePosition[0] += 1;
        userPlatePosition[1] += 1;

        if (gameInterval == null) {
            ballInY += 1;
        }
    } else if (userPlatePosition[1] - 1 == widthtLimit) {
        return
    } else {
        userPlatePosition[0] += plateMovementUnit;
        userPlatePosition[1] += plateMovementUnit;

        if (gameInterval == null) {
            ballInY += plateMovementUnit;
        }
    }

    userPlate.style.gridColumn = `${userPlatePosition[0]} / ${userPlatePosition[1]}`
    if (gameInterval == null) {
        ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
    }
}

function pausePlay() {
    if (gameInterval == null) {
        if (velocityY == 0) {
            velocityY = [1, -1][Math.floor(Math.random() * 2)];
        }
        startGame.innerText = "«";
        gameInterval = setInterval(initGame, gameSpeed)
    } else {
        startGame.innerText = "■";
        clearInterval(gameInterval);
        gameInterval = null;
    }

    userPlate.style.gridColumn = `${userPlatePosition[0]} / ${userPlatePosition[1]}`
    if (gameInterval == null) {
        ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
    }
}

// Event listeners to play the game
window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowLeft") {
        ArrowLeft();
    } else if (e.code == "ArrowRight") {
        ArrowRight();
    } else if (e.code == "Space") {
        pausePlay();
    }
});

// Play game using button
leftController.addEventListener("click", ArrowLeft)

rightController.addEventListener("click", ArrowRight)

startGame.addEventListener("click", pausePlay)

// Change ball position
function changeBallPosition() {
    ballInX += velocityX;
    ballInY += velocityY;

    ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
}

// Check Ball position
function checkBallPosition() {
    if ((ballInX == heightLimit - 1) && ((ballInY >= userPlatePosition[0]) && (ballInY < userPlatePosition[1]))) {
        ballHitAudio.play();
        velocityX = -1;
    }

    if (ballInX == 1) {
        velocityX = 1;
    }
    if (ballInY == 1) {
        velocityY = 1;
    }
    if (ballInY == widthtLimit) {
        velocityY = -1;
    }

}

// Ball Hits Brick
function ballHitsBrick(brickId) {
    let theBrick = document.querySelector(`[data-brickId="${brickId}"]`);

    if (theBrick.classList.contains("none")) {
        return false;
    }

    pointAudio.currentTime = 0;
    pointAudio.play();
    setTimeout(() => {
        theBrick.classList.add("none");
    }, 80);

    setScoreBoard();
    return true;
}


// Check if the ball hits Bricks
function checkBallHitsBrick() {
    for (let i = 0; i < bricksPositions.length; i++) {
        let currentBrick = bricksPositions[i];
        // currentBrick[0] = Start position of brick in Y axis
        // currentBrick[1] = End position of brick in Y axis
        // currentBrick[2] = Start position of brick in X axis
        // Hit the Top
        if ((ballInX + 1 == currentBrick[2]) && ((ballInY >= currentBrick[0]) && (ballInY < currentBrick[1]))) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityX = -1;
            break;
        }
        // Hit the Bottom
        else if ((ballInX - 1 == currentBrick[2]) && ((ballInY >= currentBrick[0]) && (ballInY < currentBrick[1]))) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityX = 1;
            break;
        }
        // Hit the Left
        else if ((ballInY + 1 == currentBrick[0]) && (ballInX == currentBrick[2])) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityY = -1;
            break;
        }
        // Hit the right
        else if ((ballInY == currentBrick[1]) && (ballInX == currentBrick[2])) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityY = 1;
            break;
        }
        // Hit the top Left
        else if ((ballInX + 1 == currentBrick[2]) && (ballInY + 1 == currentBrick[0])) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityX = -1;
            velocityY = -1;
            break;

        }
        // Hit the top Right
        else if ((ballInX + 1 == currentBrick[2]) && (ballInY == currentBrick[1])) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityX = -1;
            velocityY = 1;
            break;
        }
        // Hit the bottom Left
        else if ((ballInX - 1 == currentBrick[2]) && (ballInY + 1 == currentBrick[0])) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityX = 1;
            velocityY = -1;
            break;

        }
        // Hit the bottom Right
        else if ((ballInX - 1 == currentBrick[2]) && (ballInY == currentBrick[1])) {
            if (ballHitsBrick(i) == false) {
                continue
            }

            velocityX = 1;
            velocityY = 1;
            break;

        }
    }

    // check if every bricks broke!
    let brokeBricks = document.querySelectorAll(".none");
    if (brokeBricks.length == bricksAmount) {
        levelComplete();
        return true;
    }

    return false;
}

// Clear Bricks
function clearBricks() {
    for (let i = 0; i < bricksPositions.length; i++) {
        let brick = document.querySelector(`[data-brickId="${i}"]`);
        gameBoard.removeChild(brick);
    }
}

// Game Level Complete
function levelComplete() {
    clearInterval(gameInterval);
    level += 1;

    gameVictoryAudio.play();
    notice.innerText = "Level Complete!";
    notice.style.display = "block";
    setTimeout(() => {
        notice.style.display = "none";
        clearBricks();
        setupGame();
        showLevel();
    }, 2000);

}

// Show game Over
function gameOver() {
    clearInterval(gameInterval);
    gameOverAudio.play();

    level = 0;
    currentLives = 3;

    notice.innerText = "Game Over!";
    notice.style.display = "block";

    setTimeout(() => {
        notice.style.display = "none";
        clearBricks();
        setupGame();
    }, 2000);
}

// Check if game Over!
function checkGameOver() {
    if (ballInX == heightLimit + 1) { // For getting the all out of box,(+1)
        currentLives -= 1;
        if (currentLives == 0) {
            gameOver(); // level Game Over
            return true;
        }

        clearInterval(gameInterval);
        gameInterval = null;

        // Live Gone
        setTimeout(() => {
            lives.innerText = "0" + currentLives;
            startGame.innerText = "■"; 
            resetPositions(true);
        }, 1000);

        return true;
    }

    return false;
}

// Inisialize Game
function initGame() {
    changeBallPosition();
    checkBallPosition();
    if (checkBallHitsBrick()) {
        return
    }
    if (checkGameOver()) {
        return
    }
}

// Set Game at First
setupGame();
showLevel();
setScoreBoard();
