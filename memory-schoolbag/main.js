document.addEventListener("DOMContentLoaded", () => {
  const availableCards = ["schoolbag","pen","eraser","book","pencil","pencil-case","notebook"];
  const cards = [];
  const cardsChosenId = [];
  const maxCardsToShow = 4;

  const sounds = {
    schoolbag: new Audio("sounds/schoolbag.mp3"),
    pen: new Audio("sounds/pen.mp3"),
    eraser: new Audio("sounds/eraser.mp3"),
    book: new Audio("sounds/book.mp3"),
    pencil: new Audio("sounds/pencil.mp3"),
    "pencil-case": new Audio("sounds/pencil-case.mp3"),
    notebook: new Audio("sounds/notebook.mp3"),
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

  function flipCard() {
    this.removeEventListener("click", flipCard);

    const cardId = this.getAttribute("data-id");
    cardsChosenId.push(cardId);
    this.setAttribute("alt", cards[cardId].name);
    this.setAttribute(
      "src",
      cards[cardId].showText
        ? `images/${cards[cardId].name}-text.png`
        : `images/${cards[cardId].name}.png`
    );
    sounds[cards[cardId].name].play();
    if (cardsChosenId.length === 2) {
      setTimeout(showCommands(), 3500);
    }
  }

  const flipCardBack = (card) => {
    card.setAttribute("alt", "question");
    card.setAttribute("src", "images/question.png");
    card.addEventListener("click", flipCard);
  };

  const updateMatches = (qty) => {
    matches = qty;
    resultText.textContent = `YOU FOUND ${matches} PAIRS OF ${maxCardsToShow}`;
    if (matches === maxCardsToShow) {
      modal.style.display = "flex";
    } 
  };

  const setCardOk = (card) => {
    card.removeEventListener("click", flipCard);
    card.setAttribute("src", "images/ok.png");
  };

  const checkIfCardsMatch = (isCorrect) => {
    const card0 = document.querySelector(`.card-${cardsChosenId[0]}`);
    const card1 = document.querySelector(`.card-${cardsChosenId[1]}`);

    if (isCorrect && card0.alt !== card1.alt) {
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

  const createCard = (id) => {
    const card = document.createElement("img");
    card.setAttribute("data-id", id);
    card.setAttribute("alt", "question");
    card.setAttribute("src", "images/question.png");
    card.classList.add(`card-${id}`);
    card.addEventListener("click", flipCard);
    return card;
  };

  const shuffleCards = () => {
    cards.length = 0;

    availableCards.sort(() => 0.5 - Math.random());

    for(let i = 0; i < maxCardsToShow; i++) {
      cards.push({ name: availableCards[i], showText: false });
      cards.push({ name: availableCards[i], showText: true });
    };

    cards.sort(() => 0.5 - Math.random());
  };

  const createBoard = () => {
    modal.style.display = "none";
    updateMatches(0);
    shuffleCards();
    grid.querySelectorAll("*").forEach((n) => n.remove());
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
