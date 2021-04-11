document.addEventListener("DOMContentLoaded", () => {
  const MAX_ATTEMPTS = 9;
  const hangman = document.getElementById("hangmanPicture");
  const restartButton = document.getElementById("restart");
  const imageResult = document.getElementById("image-result");
  const alphabetContainer = document.getElementById("alphabet-container");
  const tipList = document.getElementById("tips");
  const imageTip = document.getElementById("imageTip");
  const modal = document.getElementById("modal");
  const old_secrets = [];

  const words = [
    {
      name: 'orange',
    },
    {
      name: 'pear',
    },
    {
      name: 'melon',
    },
    {
      name: 'banana',
    },
    {
      name: 'apple',
    },
    {
      name: 'lemon',
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
    hangman.src = `images/assets/${incorrectGuess}.png`;
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
    if (incorrectGuess == MAX_ATTEMPTS - 2) {
      imageTip.src = `images/tips/${secret}.png`;
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
      imageResult.src = "images/assets/great-job.png";
      imageResult.attributes.alt = "Great Job!";
    } else {
      imageResult.src = "images/assets/never-give-up.png";
      imageResult.attributes.alt = "Never give up!";
    }

    if (incorrectGuess == MAX_ATTEMPTS) {
      fillTheWordToDiscover();
    }

    modal.style.display = "flex";
    alphabetContainer.style.display = "none";

    return;
  };

  const clearTips = () => {
    tipList.innerHTML = "";
    imageTip.src = "";
    imageTip.style.display = "none";
  };

  const shuffleOptions = () => {
    do {
      words.sort(() => 0.5 - Math.random());
    } while(old_secrets.indexOf(words[0]) !== -1);
    
    old_secrets.shift();
    old_secrets.push(words[0]);
    
    const choice = words[0];

    secret = choice.name;
    tip1 = choice.tip1;
    tip2 = choice.tip2;
  };

  const createGame = () => {
    clearTips();
    modal.style.display = "none";
    alphabetContainer.style.display = "block";

    correctGuess = 0;
    incorrectGuess = 0;
    shuffleOptions();
    lettersToFind = secret.length;
    updateHangman();
    createLettersToDiscover();
    createAlphateb();

    return false;
  };

  restartButton.addEventListener("click", createGame);
  createGame();
});
