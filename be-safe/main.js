document.addEventListener("DOMContentLoaded", () => {
  const availableCards = [
    {
      name: "our-school",
    },
    {
      name: "stay-home",
    },
    {
      name: "wash-your-hands",
    },
    {
      name: "wear-mask",
    },
  ];

  const sounds = {
    'our-school': new Audio('sounds/our-school.mp3'),
    'stay-home': new Audio('sounds/stay-home.mp3'),
    'wash-your-hands': new Audio('sounds/wash-your-hands.mp3'),
    'wear-mask': new Audio('sounds/wear-mask.mp3'),
  };

  const cards = [];
  const cardsChosenId = [];
  let matches = 0;

  const grid = document.querySelector(".grid");
  const commandsContainer = document.querySelector(".commands");

  function showCommands() {
    commandsContainer.style.display = "flex";
    grid.classList.add("disabledDiv");
  };

  function flipCard() {
    this.removeEventListener("click", flipCard);

    const cardId = this.getAttribute("data-id");
    cardsChosenId.push(cardId);
    this.setAttribute("alt", cards[cardId].name);
    this.setAttribute("src", `images/${cards[cardId].name}.png`);
    sounds[cards[cardId].name].play();
    if (cardsChosenId.length === 2) {
      setTimeout(showCommands(), 3500);
    }
  }

  const updateMatches = (qty) => {
    matches = qty;
    if (matches === availableCards.length) {
      document.getElementById("restart").style.display = "block";

      document.getElementById("result").textContent = "GOOD JOB! YOU FOUND ALL PAIRS!";
      document.getElementById("result").classList.add("good-job");
    } else {
      document.getElementById(
        "result"
      ).textContent = `YOU FOUND ${matches} PAIRS OF ${availableCards.length}`;
    }
  };

  const setCardOk = (card) => {
    card.setAttribute("src", "images/ok.svg");
  };

  const flipCardBack = (card) => {
    card.setAttribute("alt", "question");
    card.setAttribute("src", "images/question.svg");
    card.addEventListener("click", flipCard);
  };

  const checkIfCardsMatch = (isCorrect) => {
    commandsContainer.style.display = "none";
    grid.classList.remove("disabledDiv");

    const card0 = document.querySelector(`.card-${cardsChosenId[0]}`);
    const card1 = document.querySelector(`.card-${cardsChosenId[1]}`);
    if (isCorrect) {
      setCardOk(card0);
      setCardOk(card1);
      updateMatches(++matches);
    } else {
      flipCardBack(card0);
      flipCardBack(card1);
    }
    cardsChosenId.splice(0, 2);
  };

  const createCard = (id) => {
    const card = document.createElement("img");
    card.setAttribute("data-id", id);
    card.setAttribute("alt", "question");
    card.setAttribute("src", "images/question.svg");
    card.classList.add(`card-${id}`);
    card.addEventListener("click", flipCard);
    return card;
  };

  const suffleCards = () => {
    cards.length = 0;

    availableCards.forEach((card) => {
      cards.push(card);
      cards.push(card);
    });

    cards.sort(() => 0.5 - Math.random());
  };

  const createBoard = () => {
    updateMatches(0);
    suffleCards();
    grid.querySelectorAll("*").forEach((n) => n.remove());
    for (let i = 0; i < cards.length; i++) {
      grid.appendChild(createCard(i));
    }
    commandsContainer.style.display = "none";
    document.getElementById("result").classList.remove("good-job");
    document.getElementById("restart").style.display = "none";
  };

  document.getElementById("correctAnswer").addEventListener("click", () => checkIfCardsMatch(true));
  document.getElementById("incorrectAnswer").addEventListener("click", () => checkIfCardsMatch(false));
  document.getElementById("restart").addEventListener("click", createBoard);

  createBoard();
});
