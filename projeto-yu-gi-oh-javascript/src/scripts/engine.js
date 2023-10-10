const state = {
    score : {
        playerScore : 0,
        computerScore : 0,
        scoreBox : document.getElementById("score_points"), 
    },
    cardsSprite : {
        avatar : document.getElementById("card-image"),
        name : document.getElementById("card-name"),
        type : document.getElementById("card-type"),
    },
    fieldCards : {
        player : document.getElementById("player-field-card"),
        computer : document.getElementById("computer-field-card"),
    },
    playerSides : {
        player1 : "player-cards",
        player1BOX : document.querySelector("#player-cards"),
        computer : "computer-cards",
        computerBOX : document.querySelector("#computer-cards"),
    },
    action : {
        button : document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1 : "player-cards",
    computer : "computer-cards",
}

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1, 4, 7, 10],
        loseOf: [2, 5, 8],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2, 5, 8],
        loseOf: [0, 3, 6, 9],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0, 3, 6, 9],
        loseOf: [1, 4, 7, 10],
    },
    {
        id: 3,
        name: "Red Eyes Black Dragon",
        type: "Paper",
        img: `${pathImages}black-dragon.png`,
        winOf: [1, 4, 7, 10],
        loseOf: [2, 5, 8],
    },
    {
        id: 4,
        name: "Baby Dragon",
        type: "Rock",
        img: `${pathImages}baby-dragon.png`,
        winOf: [2, 5, 8],
        loseOf: [0, 3, 6, 9],
    },
    {
        id: 5,
        name: "Obelisk The Tormentor",
        type: "Scissors",
        img: `${pathImages}obelisk.png`,
        winOf: [0, 3, 6, 9],
        loseOf: [1, 4, 7, 10],
    },
    {
        id: 6,
        name: "Slifer The Sky Dragon",
        type: "Paper",
        img: `${pathImages}slifer.png`,
        winOf: [1, 4, 7, 10],
        loseOf: [2, 5, 8],
    },
    {
        id: 7,
        name: "The Winged Dragon of Ra",
        type: "Rock",
        img: `${pathImages}ra.png`,
        winOf: [2, 5, 8],
        loseOf: [0, 3, 6, 9],
    },
    {
        id: 8,
        name: "Summoned Skull",
        type: "Scissors",
        img: `${pathImages}skull.png`,
        winOf: [0, 3, 6, 9],
        loseOf: [1, 4, 7, 10],
    },
    {
        id: 9,
        name: "Thousand Dragon",
        type: "Paper",
        img: `${pathImages}thousand-dragon.png`,
        winOf: [1, 4, 7, 10],
        loseOf: [2, 5, 8],
    },
    {
        id: 10,
        name: "Time Wizard",
        type: "Rock",
        img: `${pathImages}time-wizard.png`,
        winOf: [2, 5, 8],
        loseOf: [0, 3, 6, 9],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor (Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");


    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () =>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImage();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImage(true);

    await hiddenCardDetails();   
    
    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId); 

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImage(value){
    
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"
    }

}

async function hiddenCardDetails() {
    state.cardsSprite.avatar.src = "";
    state.cardsSprite.name.innerText = "";
    state.cardsSprite.type.innerText = "";
}

async function drawButton(text) {
    state.action.button.innerText = text;
    state.action.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)){
        duelResults = "VICTORY";
        state.score.playerScore++;
        playAudio("Win");
    }

    if (playerCard.loseOf.includes(computerCardId)){
        duelResults = "DEFEAT";
        state.score.computerScore++;
        playAudio("Lose");
    }

    return duelResults;

}


async function removeAllCardsImage () {

    let { computerBOX, player1BOX } = state.playerSides;
    
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}


async function drawSelectedCard(index) {
    state.cardsSprite.avatar.src = cardData[index].img;
    state.cardsSprite.name.innerText = cardData[index].name;
    state.cardsSprite.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardsSprite.avatar.src = "";
    state.action.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init ();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {

    showHiddenCardFieldsImage(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.1;
    bgm.play();    
}

init();