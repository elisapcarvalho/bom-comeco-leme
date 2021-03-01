document.addEventListener("DOMContentLoaded", () => {
  const MAX_ATTEMPTS = 9;
  const hangman = document.getElementById("hangmanPicture");
  const restartButton = document.getElementById("restart");
  // const restartContainer = document.getElementById("restart-container");
  // const resultText = document.getElementById("result");
  const imageResult = document.getElementById("image-result");
  const alphabetContainer = document.getElementById("alphabet-container");
  const tipList = document.getElementById("tips");
  const imageTip = document.getElementById("imageTip");
  const modal = document.getElementById("modal");

  const words = [
    {
      name: 'turtle',
      tip1: 'Podemos encontrá-la tanto na àgua quanto na terra',
      tip2: 'Ela se movimenta bem devagar'
    },
    {
      name: 'elephant',
      tip1: 'Ele é muito grande e tem ótima memória',
      tip2: 'Tem uma tromba muito grande'
    },
  ];

  let secret = "";
  let tip1 = "";
  let tip2 = "";

  let lettersToFind;
  let correctGuess;
  let incorrectGuess;

  const createLettersToDiscover = () => {

    const lettersContainer = document.getElementsByClassName(
      "letters-container"
    )[0];
    lettersContainer.innerHTML = "";
    for (var i = 0; i < secret.length; i++) {
      const div = document.createElement("div");
      div.classList.add("letter");
      const h2 = document.createElement("h2");
      h2.value = " ";
      h2.dataset.letter = secret.toUpperCase()[i];
      div.appendChild(h2);
      lettersContainer.appendChild(div);
    }
  };

  const createAlphateb = () => {
    const A = 65;
    const Z = 91;

    alphabetContainer.innerHTML = "";
    for (let letter = A; letter < Z; letter++) {
      const button = document.createElement("input");
      button.type = "button";
      button.classList.add("alphabet-button");
      button.value = String.fromCharCode(letter);
      button.onclick = buttonClicked;
      alphabetContainer.appendChild(button);
    }
  };

  const checkIfGuessIsCorrect = (guess) => {
    const correctLetters = document.querySelectorAll(`[data-letter=${guess}]`);
    for (let i = 0; i < correctLetters.length; i++) {
      correctLetters[i].innerHTML = guess;
    }
    return correctLetters.length;
  };

  const updateHangman = () => {
    hangman.src = `images/${incorrectGuess}.png`;
  };

  const buttonClicked = (e) => {
    const found = checkIfGuessIsCorrect(e.target.value);
    e.target.disabled = true;
    e.target.classList.add("guess-used");
    if (found > 0) {
      e.target.classList.add("correct-guess");
      correctGuess += found;
    } else {
      e.target.classList.add("incorrect-guess");
      incorrectGuess++;
      updateHangman();
      showTips();
    }
    checkIfGameFinished();
    return false;
  };

  const showTips = () => {
    if (incorrectGuess == MAX_ATTEMPTS - 3) {
      const tip1element = document.createElement("li");
      tip1element.innerHTML = tip1;
      tipList.appendChild(tip1element);
      return;
    }
    if (incorrectGuess == MAX_ATTEMPTS - 2) {
      const tip2element = document.createElement("li");
      tip2element.innerHTML = tip2;
      tipList.appendChild(tip2element);
      return;
    }
    if (incorrectGuess == MAX_ATTEMPTS - 1) {
      imageTip.src = `images/${secret}.png`;
      imageTip.style.display = "block";
      return;
    }
    return;
  };

  const fillTheWordToDiscover = () => {
    document.querySelectorAll('[data-letter]').forEach(letter => {
      letter.innerHTML = letter.dataset.letter;
    });
  };

  const checkIfGameFinished = () => {
    if (correctGuess < lettersToFind && incorrectGuess < MAX_ATTEMPTS) {
      return;
    }

    if (correctGuess == lettersToFind) {
      imageResult.src = "images/great-job.png";
      imageResult.attributes.alt = "Great Job!";
    } else {
      imageResult.src = "images/never-give-up.png";
      imageResult.attributes.alt = "Never give up!";
    }
    // resultText.innerHTML =
    //   correctGuess == lettersToFind
    //     ? "Yeah!!! Congratulations!!!"
    //     : "Oh no!!! Try again!!!";

    if (incorrectGuess == MAX_ATTEMPTS) {
      fillTheWordToDiscover();
    }

    modal.style.display = "flex";
    // restartContainer.style.display = "flex";
    alphabetContainer.style.display = "none";

    return;
  };

  const clearTips = () => {
    tipList.innerHTML = "";
    imageTip.src = "";
    imageTip.style.display = "none";
  };

  const suffleOptions = () => {
    words.sort(() => 0.5 - Math.random());

    const choice = words[0];

    secret = choice.name;
    tip1 = choice.tip1;
    tip2 = choice.tip2;
  };

  const createGame = () => {
    clearTips();
    modal.style.display = "none";
    // restartContainer.style.display = "none";
    alphabetContainer.style.display = "block";

    correctGuess = 0;
    incorrectGuess = 0;
    suffleOptions();
    lettersToFind = secret.length;
    updateHangman();
    createLettersToDiscover();
    createAlphateb();

    return false;
  };

  restartButton.addEventListener("click", createGame);
  createGame();
});
