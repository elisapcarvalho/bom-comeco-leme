document.addEventListener("DOMContentLoaded", () => {
  const alphabetContainer = document.getElementById("alphabet-container");
  const resultContainer = document.getElementById("result-container");
  const optionsContainer = document.getElementById("options-container");
  const wordContainer = document.getElementById("word-container");

  let selectedLetter = "";
  let missingLetter = "";

  const options = [
    {
      name: "ball",
      picture: "ball.jpg"
    },
    {
      name: "bike",
      picture: "bike.jpg"
    },
    {
      name: "blocks",
      picture: "blocks.jpg"
    },
    {
      name: "car",
      picture: "car.jpg"
    },
    {
      name: "doll",
      picture: "doll.jpg"
    },
    {
      name: "kite",
      picture: "kite.jpg"
    },
  ];

  let sortedOptions = [];

  const createAlphabet = () => {
    const A = 65;
    const Z = 91;

    alphabetContainer.innerHTML = "";
    for (let letter = A; letter < Z; letter++) {
      const h2 = document.createElement("h2");
      h2.textContent = String.fromCharCode(letter);

      const div = document.createElement("div");
      div.id = `letter-${String.fromCharCode(letter)}`;
      div.dataset.letter = String.fromCharCode(letter);
      div.setAttribute("draggable", true);
      div.classList.add("letter");
      div.addEventListener("dragstart", dragStart);

      div.appendChild(h2);
      alphabetContainer.appendChild(div);
    }
  };

  const dragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    selectedLetter = e.target.dataset.letter;
  };

  const dragEnter = (e) => {
    if (selectedLetter == missingLetter) {
      e.preventDefault();
    }
    e.target.classList.add("drag-over");
  }

  const dragLeave = (e) => {
    e.target.classList.remove("drag-over");
  }

  const drop = (e) => {
    e.target.classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    const letter = document.getElementById(id);
    const target = e.target.tagName == "div" ? e.target.children[0] : e.target;
    target.innerHTML = missingLetter;

    resultContainer.style.display = "flex";
    optionsContainer.style.display = "none";
  }

  const drawAnOption = () => {
    if (sortedOptions.length == 0) {
      sortedOptions = options.sort(() => Math.random() - 0.5);
    }

    return sortedOptions.pop();
  };

  const showTheWordOfSelectedOption = word => {
    wordContainer.innerHTML = "";
    const indexOfLetterToDiscover = Math.floor(Math.random() * word.length);
    for (let i = 0; i < word.length; i++) {
      const div = document.createElement("div");
      div.classList.add("word-letter");

      const h2 = document.createElement("h2");
      h2.innerHTML = i == indexOfLetterToDiscover ? " " : word[i];
      div.appendChild(h2);

      if (i == indexOfLetterToDiscover) {
        missingLetter = word[i];
        h2.classList.add("missing-letter")
        div.addEventListener("dragenter", dragEnter);
        div.addEventListener("dragover", dragEnter);
        div.addEventListener("dragleave", dragLeave);
        div.addEventListener("drop", drop);
      }

      wordContainer.appendChild(div);
    }
  };

  const showTheImageOfSelectedOption = image => {
    document.getElementById("image-tip").src = `images/${image}`;
  };

  const createGame = () => {
    resultContainer.style.display = "none";
    optionsContainer.style.display = "flex";
    const selectedOption = drawAnOption();
    showTheWordOfSelectedOption(selectedOption.name.toUpperCase());
    showTheImageOfSelectedOption(selectedOption.picture);
    createAlphabet();
  };

  document.getElementById("restart").addEventListener("click", createGame);
  createGame();
});