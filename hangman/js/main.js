document.addEventListener("DOMContentLoaded", () => {
  const MAX_ATTEMPTS = 9;
  const hangman = document.getElementById("hangmanPicture");
  const restartButton = document.getElementById("restart");
  const resultText = document.getElementById("result");
  const tipList = document.getElementById("tips");
  const imageTip = document.getElementById("imageTip");

  const secret = "turtle";
  
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
      div.classList.add(secret.toUpperCase()[i]);
      const h2 = document.createElement("h2");
      h2.value = " ";
      div.appendChild(h2);
      lettersContainer.appendChild(div);
    }
  };

  const createAlphateb = () => {
    const A = 65;
    const Z = 91;
    const alphabetContainer = document.getElementsByClassName(
      "alphabet-container"
    )[0];

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
    const correctLetters = document.getElementsByClassName(`letter ${guess}`);
    for (let i = 0; i < correctLetters.length; i++) {
      correctLetters[i].children[0].innerHTML = guess;
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
          const tip1 = document.createElement('li');
          tip1.innerHTML = 'Podemos encontrá-la tanto na àgua quanto na terra';
          tipList.appendChild(tip1);
          return;  
      }
      if (incorrectGuess == MAX_ATTEMPTS - 2) {
        const tip2 = document.createElement('li');
        tip2.innerHTML = 'Ela se movimenta bem devagar';
        tipList.appendChild(tip2);
        return;  
    }
    if (incorrectGuess == MAX_ATTEMPTS - 1) {
        imageTip.src = 'images/turtle.png';
        imageTip.style.display = 'block';
        return;  
    }
    return;
  };

  const checkIfGameFinished = () => {
    if (correctGuess == lettersToFind) {
      resultText.innerHTML = "Yeah!!! Congratulations!!!";
      restartButton.style.display = 'block';
      return;
    }

    if (incorrectGuess == MAX_ATTEMPTS) {
        resultText.innerHTML = "Oh no!!! Try again!!!";
        restartButton.style.display = 'block';
        return;
    }

    return;
  };

  const clearTips = () => {
    tipList.innerHTML = "";
    imageTip.src = "";
    imageTip.style.display = 'none';
  };

  const createGame = () => {
    restartButton.style.display = "none";
    resultText.innerHTML = "";
    clearTips();

    correctGuess = 0;
    incorrectGuess = 0;
    lettersToFind = secret.length;
    updateHangman();
    createLettersToDiscover();
    createAlphateb();

    return false;
  };

  restartButton.addEventListener("click", createGame);
  createGame();
});
