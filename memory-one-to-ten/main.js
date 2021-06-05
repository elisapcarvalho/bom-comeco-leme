document.addEventListener("DOMContentLoaded", () => {
  const availableCards = [
    {
      id: 0,
      text: "1",
      sound: "one",
    },
    {
      id: 1,
      text: "2",
      sound: "two",
    },
    {
      id: 2,
      text: "3",
      sound: "three",
    },
    {
      id: 3,
      text: "4",
      sound: "four",
    },
    {
      id: 4,
      text: "5",
      sound: "five",
    },
    {
      id: 5,
      text: "6",
      sound: "six",
    },
    {
      id: 6,
      text: "7",
      sound: "seven",
    },
    {
      id: 7,
      text: "8",
      sound: "eight",
    },
    {
      id: 8,
      text: "9",
      sound: "nine",
    },
    {
      id: 9,
      text: "10",
      sound: "ten",
    }
  ];
  const cards = [];
  const cardsChosenId = [];
  const maxCardsToShow = 4;
  const playCardSound = true;

  const sounds = {
    one: new Audio("sounds/one.mp3"),
    two: new Audio("sounds/two.mp3"),
    three: new Audio("sounds/three.mp3"),
    four: new Audio("sounds/four.mp3"),
    five: new Audio("sounds/five.mp3"),
    six: new Audio("sounds/six.mp3"),
    seven: new Audio("sounds/seven.mp3"),
    eight: new Audio("sounds/eight.mp3"),
    nine: new Audio("sounds/nine.mp3"),
    ten: new Audio("sounds/ten.mp3"),
    error: new Audio("sounds/error.mp3"),
  };

  let matches = 0;

  const grid = document.querySelector(".grid");
  const commandsContainer = document.querySelector(".commands");
  const modal = document.getElementById("modal");
  const resultText = document.getElementById("result");

  function showCommands() {
    commandsContainer.style.display = "flex";
    grid.classList.add("disabledDiv");
  }

  const updateMatches = (qty) => {
    matches = qty;
    resultText.textContent = `YOU FOUND ${matches} PAIRS OF ${maxCardsToShow}`;
    if (matches === maxCardsToShow) {
      modal.style.display = "flex";
    } 
  };

  const setCardOk = (card) => {
    const inner = document.createElement("img");
    inner.setAttribute("src", "images/ok.png");
    inner.className = "card-img";
    card.querySelectorAll("*").forEach((n) => n.remove());
    card.className = "card card-ok";
    card.appendChild(inner);
  };

  const checkIfCardsMatch = (isCorrect) => {
    const card0 = document.querySelector(`div[data-id="${cardsChosenId[0].cardId}"]`);
    const card1 = document.querySelector(`div[data-id="${cardsChosenId[1].cardId}"]`);

    const cardId0 = cardsChosenId[0].chosenCardId;
    const cardId1 = cardsChosenId[1].chosenCardId;

    if (isCorrect && cardId0  !== cardId1) {
      sounds["error"].play();
      resultText.textContent = "CHECK YOUR ANSWER!!!";
      return;
    }

    commandsContainer.style.display = "none";
    grid.classList.remove("disabledDiv");

    if (isCorrect) {
      setCardOk(card0);
      setCardOk(card1);
      updateMatches(++matches);
    } else {
      flipCardBack(card0);
      flipCardBack(card1);
      updateMatches(matches);
    }
    cardsChosenId.splice(0, 2);
  };

  function flipCard() {
    this.removeEventListener("click", flipCard);

    const cardId = this.getAttribute("data-id");
    const chosenCard = cards[cardId];
    cardsChosenId.push({cardId, chosenCardId: chosenCard.id});

    this.querySelectorAll("*").forEach((n) => n.remove());
    this.className = "card card-choosen"
    const text = document.createElement("span");
    text.innerHTML = availableCards[chosenCard.id].text;
    text.className = "card-text";
    this.appendChild(text);

    if (playCardSound) {
      sounds[availableCards[chosenCard.id].sound].play();
    }

    if (cardsChosenId.length === 2) {
      setTimeout(showCommands(), 3500);
    }
  }

  const flipCardBack = (card) => {
    createQuestionCard(card);
  };

  const createQuestionCard = (div) => {
    const inner = document.createElement("span");
    const id = div.getAttribute("data-id");
    inner.innerHTML = parseInt(id) + 1;
    inner.className = "card-question-id";
    div.querySelectorAll("*").forEach((n) => n.remove());
    div.appendChild(inner);
    div.className = "card card-question";
    div.addEventListener("click", flipCard);
  }

  const createCard = (id) => {
    const card = document.createElement("div");
    card.setAttribute("data-id", id);
    createQuestionCard(card);
    return card;
  };

  const shuffleCards = () => {
    cards.length = 0;

    availableCards.sort(() => 0.5 - Math.random());

    for(let i = 0; i < maxCardsToShow; i++) {
      cards.push({ id: availableCards[i].id });
      cards.push({ id: availableCards[i].id });
    };

    cards.sort(() => 0.5 - Math.random());
  };

  const createBoard = () => {
    modal.style.display = "none";
    updateMatches(0);
    shuffleCards();
    grid.querySelectorAll("*").forEach((n) => {
      n.removeEventListener("click", flipCard);
      n.remove();
    });
    for (let i = 0; i < cards.length; i++) {
      grid.appendChild(createCard(i));
    }
    commandsContainer.style.display = "none";
  };

  document
    .getElementById("correctAnswer")
    .addEventListener("click", () => checkIfCardsMatch(true));
  document
    .getElementById("incorrectAnswer")
    .addEventListener("click", () => checkIfCardsMatch(false));
  document.getElementById("restart").addEventListener("click", createBoard);

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  createBoard();
});
