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

  const cards = [];

  const grid = document.querySelector(".grid");
  const cardsChosenId = [];
  let matches = 0;

  function flipCard() {
    this.removeEventListener("click", flipCard);

    const cardId = this.getAttribute("data-id");
    cardsChosenId.push(cardId);
    this.setAttribute("alt", cards[cardId].name);
    this.setAttribute("src", `images/${cards[cardId].name}.png`);
    const audio = new Audio(`sounds/${cards[cardId].name}.mp3`);
    audio.play();
    if (cardsChosenId.length === 2) {
      setTimeout(checkIfCardsMatch, 3500);
    }
  }

  const updateMatches = (qty) => {
    matches = qty;
    if (matches === availableCards.length) {
      document.getElementById("restart").style.display = "block";

      document.getElementById("result").textContent =
        "Good job! You found all pairs";
    } else {
      document.getElementById(
        "result"
      ).textContent = `You found ${matches} pairs of ${availableCards.length}`;
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

  const checkIfCardsMatch = () => {
    const card0 = document.querySelector(`.card-${cardsChosenId[0]}`);
    const card1 = document.querySelector(`.card-${cardsChosenId[1]}`);
    if (card0.getAttribute("alt") === card1.getAttribute("alt")) {
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
    document.getElementById("restart").style.display = "none";
  };

  createBoard();
  document.getElementById("restart").addEventListener("click", createBoard);
});
