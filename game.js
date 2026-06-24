const game = document.getElementById("game");

const player = document.getElementById("player");

const scoreEl = document.getElementById("score");

const levelEl = document.getElementById("level");

const speedEl = document.getElementById("speed");

const restartBtn = document.getElementById("restartBtn");

const popup = document.getElementById("gameOverPopup");

const finalScore = document.getElementById("finalScore");

const finalLevel = document.getElementById("finalLevel");

const finalHigh = document.getElementById("finalHigh");

const highEl = document.getElementById("highscore");


function getLanes() {

    const w = game.clientWidth;

    return [

        w * 0.08,

        w * 0.42,

        w * 0.75

    ];

}

let lanes = getLanes();

window.addEventListener("resize", () => {

    lanes = getLanes();

});

let currentLane = 1;

let score = 0;

let level = 1;

let speed = 6;

let gameOver = false;


let highscore = localStorage.getItem("fazzio_high") || 0;

highEl.innerText = highscore;


player.style.left = lanes[currentLane] + "px";

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowLeft") {

        movePlayer("left");

    }

    if (e.key === "ArrowRight") {

        movePlayer("right");

    }

});

let touchStartX = 0;

game.addEventListener("touchstart", (e) => {

    if (gameOver) return;

    const touchX = e.touches[0].clientX;

    const rect = game.getBoundingClientRect();

    const middle = rect.left + rect.width / 2;


    if (touchX < middle) {

        movePlayer("left");

    } else {

        movePlayer("right");

    }

}, {
    passive: true
});

function updateLevel() {

    let newLevel = Math.floor(score / 5) + 1;


    if (newLevel > level) {

        level = newLevel;

        speed += 1;

        levelEl.innerText = level;

        speedEl.innerText = speed;

    }

}



function updateScore() {

    score++;

    scoreEl.innerText = score;


    if (score > highscore) {

        highscore = score;

        localStorage.setItem("fazzio_high", highscore);

        highEl.innerText = highscore;

    }


    updateLevel();

}

function movePlayer(direction) {

    if (gameOver) return;


    if (direction === "left" && currentLane > 0) {

        currentLane--;

        player.style.rotate = "-10deg";

    }


    if (direction === "right" && currentLane < 2) {

        currentLane++;

        player.style.rotate = "10deg";

    }


    player.style.left = lanes[currentLane] + "px";


    setTimeout(() => {

        player.style.rotate = "0deg";

    }, 120);

}

function endGame() {

    gameOver = true;

    localStorage.setItem("last_score", score);

    if (score > highscore) {

        highscore = score;

        localStorage.setItem("fazzio_high", highscore);

    }

    finalScore.innerText = score;

    finalLevel.innerText = level;

    finalHigh.innerText = highscore;

    popup.style.display = "flex";

}

restartBtn.onclick = () => {

    location.reload();

}


console.log("GAME READY");


// ====================================
// BAGIAN 2
// Enemy System
// ====================================


function checkCollision(enemy) {

    const p = player.getBoundingClientRect();

    const e = enemy.getBoundingClientRect();


    return (

        p.left < e.right &&

        p.right > e.left &&

        p.top < e.bottom &&

        p.bottom > e.top

    );

}

function checkCoinCollision(coin) {

    const p = player.getBoundingClientRect();
    const c = coin.getBoundingClientRect();

    return (

        p.left < c.right &&
        p.right > c.left &&
        p.top < c.bottom &&
        p.bottom > c.top

    );

}

function createCoin() {

    if (gameOver) return;

    const coin = document.createElement("div");

    coin.className = "coin";

    let lane = Math.floor(Math.random() * 3);

    coin.style.left = (lanes[lane] + 15) + "px";

    coin.style.top = "-50px";

    game.appendChild(coin);

    let y = -50;

    const move = setInterval(() => {

        if (gameOver) {

            clearInterval(move);
            return;

        }

        y += speed;

        coin.style.top = y + "px";

        if (checkCoinCollision(coin)) {

            clearInterval(move);

            coin.remove();

            score += 3;

            scoreEl.innerText = score;

            updateLevel();

            return;

        }

        if (y > 750) {

            clearInterval(move);

            coin.remove();

        }

    }, 20);

}

function coinLoop() {

    if (gameOver) return;

    createCoin();

    const spawn = Math.random() * 3000 + 2000;

    setTimeout(coinLoop, spawn);

}

coinLoop();



function createEnemy() {


    if (gameOver) return;


    const enemy = document.createElement("div");

    enemy.className = "enemy";


    let lane = Math.floor(Math.random() * 3);


    enemy.style.left = lanes[lane] + "px";

    enemy.style.top = "-130px";


    game.appendChild(enemy);


    let y = -130;


    const move = setInterval(() => {


        if (gameOver) {

            clearInterval(move);

            return;

        }



        y += speed;


        enemy.style.top = y + "px";



        if (checkCollision(enemy)) {

            endGame();

        }



        if (y > 750) {

            clearInterval(move);


            enemy.remove();


            updateScore();

        }


    }, 20);



}


function enemyLoop() {


    if (gameOver) return;


    createEnemy();


    let spawn = Math.max(

        1000 - (level * 60),

        350

    );


    setTimeout(enemyLoop, spawn);

}


enemyLoop();


const rain = document.getElementById("rain");


function createRain() {


    for (let i = 0; i < 80; i++) {


        const d = document.createElement("div");


        d.className = "raindrop";


        d.style.left = Math.random() * 420 + "px";


        d.style.top = Math.random() * 700 + "px";


        d.style.animationDelay = Math.random() + "s";


        rain.appendChild(d);


    }


}


createRain();