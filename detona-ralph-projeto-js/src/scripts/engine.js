const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        currentLives: 3,
        elapsedSeconds: 0,
        lastSpeedIncrease: 0,
    },
    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    }
};

function countDown() {
    state.values.currentTime--;
    state.values.elapsedSeconds++;
    
    state.view.timeLeft.textContent = state.values.currentTime;
    
    if (state.values.elapsedSeconds % 10 === 0) {
        state.values.gameVelocity -= 100;
        console.log(`Velocidade reduzida para ${state.values.gameVelocity}ms`);
    }

    if (state.values.currentTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        alert("Game Over! O seu resultado foi: " + state.values.result);
        resetGame();
    }
}



function playSound(audioName){
    let audio = new Audio(`./src/audios/${audioName}.mp3`);
    audio.volume = 0.1;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox(){
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");

                showPointsValue(event.clientX, event.clientY, 1);
            } else {     
                playSound("damage");           
                state.values.currentLives--;
                state.view.lives.textContent = `x${state.values.currentLives}`;

                if (state.values.currentLives <= 0) {
                    clearInterval(state.actions.countDownTimerId);
                    clearInterval(state.actions.timerId);
                    alert("Game Over! O seu resultado foi: " + state.values.result);
                    resetGame();
                }
            }
        })
    })
}

function resetGame() {
    
    state.values.result = 0;
    state.values.currentLives = 3;
    state.values.currentTime = 60;
    
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = `x${state.values.currentLives}`;
    state.view.timeLeft.textContent = state.values.currentTime;
    
    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function showPointsValue(x, y, points) {
    const pointsValue = document.createElement("div");
    pointsValue.classList.add("points-value");
    pointsValue.textContent = `+${points}`;

    const angle = Math.random() * 2 * Math.PI;
    
    const distance = 20 + Math.random() * 30;
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    
    pointsValue.style.left = `${x + xOffset}px`;
    pointsValue.style.top = `${y + yOffset}px`;

    document.body.appendChild(pointsValue);

    setTimeout(() => {
        pointsValue.remove();
    }, 2000);
}

function init () {
    addListenerHitBox();
}

init();