const options = [
    {
        name: 'bird',
        image: 'bird',
    },
    {
        name: 'cat',
        image: 'cat',
    },
    {
        name: 'dog',
        image: 'dog',
    },
    {
        name: 'fish',
        image: 'fish',
    },
    {
        name: 'rabbit',
        image: 'rabbit',
    },
];

const sounds = {
    'bird': new Audio('sounds/bird.mp3'),
    'cat': new Audio('sounds/cat.mp3'),
    'dog': new Audio('sounds/dog.mp3'),
    'fish': new Audio('sounds/fish.mp3'),
    'rabbit': new Audio('sounds/rabbit.mp3'),
};

const animationInterval = 30;
const imageSize = 200;
const maxNumberOfLoops = 10;
const maxTimeToRollInSeconds = 7;
const minTimeToRollInSeconds = 2;
const quantityOfImagesToNotRepeat = Math.floor(options.length * .95);
const quantityOfOptionsToAnswer = 2;
const rouletteHeight = options.length * imageSize;

const usedImages = [];

let currentOption = 0;
let currentTimeout;

const rollButton = document.getElementById("rollButton");
const roulette = document.getElementById("roulette");
const rouletteContainer = document.getElementById("roulette-container");
const answersContainer = document.getElementById("answers-container");
const answersOptions = document.getElementById("answers-options");


const getRandomOption = () => {
    const optionsQuantity = options.length;
    let sortedIndex = Math.floor(Math.random() * optionsQuantity);
    while (usedImages.indexOf(sortedIndex) > -1) {
        sortedIndex = Math.floor(Math.random() * optionsQuantity);
    }
    const usedTipsLength = usedImages.push(sortedIndex);
    if (usedTipsLength > quantityOfImagesToNotRepeat) {
        usedImages.splice(0, 1);
    }
    return sortedIndex;
};

const calculateDistance = (stopIndex) => {
    const loops = Math.ceil(Math.random() * maxNumberOfLoops);
    const optionsToCompleteTheCurrentLoop = options.length - currentOption;
    const optionsToCompleteTheLastLoop = stopIndex;

    return ((loops * options.length) + optionsToCompleteTheCurrentLoop + optionsToCompleteTheLastLoop) * imageSize;
}

const slowdown = (current, distance, total) => {
    //using function easeOutQuart from https://easings.net/
    const x = current / total;
    const factor = 1 - Math.pow(1 - x, 4);
    return distance * factor;
}

const displayResult = () => {
    clearTimeout(currentTimeout);
    const desiredY = currentOption * imageSize;
    roulette.style.transform = `translate(0px, -${desiredY}px)`;
    displayOptionsToAnswer();
}

const rollImages = (currentY, distanceRunned, distanceToRun, currentTime, totalTime) => {
    currentTime += animationInterval;
    const slowDownFactor = slowdown(currentTime, distanceToRun, totalTime);
    if ((totalTime < currentTime) || ((distanceToRun - slowDownFactor) < 0.04)) {
        displayResult();
    } else {
        currentY = (currentY + (slowDownFactor - distanceRunned)) % rouletteHeight;
        distanceRunned = slowDownFactor;
        roulette.style.transform = `translate(0px, -${currentY}px)`;
        currentTimeout = setTimeout(() => {
            rollImages(currentY, distanceRunned, distanceToRun, currentTime, totalTime);
        }, animationInterval);
    }
}

const generateOptionsToAnswer = () => {
    const optionsToAnswer = [];
    optionsToAnswer.push(currentOption);
    for (let i = 1; i < quantityOfOptionsToAnswer; i++) {
        let option = Math.floor(Math.random() * options.length);
        while (optionsToAnswer.indexOf(option) > -1) {
            option = Math.floor(Math.random() * options.length);
        }
        optionsToAnswer.push(option);
    }
    optionsToAnswer.sort(() => 0.5 - Math.random());
    return optionsToAnswer;
};

const playSound = animal => {
    sounds[animal].play();
};

const displayOptionsToAnswer = () => {
    answersContainer.style.display = 'grid';
    answersOptions.innerHTML = '';
    const optionsToAnswer = generateOptionsToAnswer();
    optionsToAnswer.forEach(answer => {
        const button = document.createElement('input');
        button.setAttribute('type', 'image');
        button.setAttribute('src', './images/ok.png');
        button.value = options[answer].name;
        button.setAttribute('alt', 'Clique se acredita que é esse animal');
        button.classList.add('answer-button');
        button.onclick = function (ev) {
            checkAnswer(this);
        };

        const soundImage = document.createElement('input');
        soundImage.setAttribute('type', 'image');
        soundImage.setAttribute('src', './images/sound.jpg');
        soundImage.setAttribute('alt', 'Clique para ouvir o nome do animal');
        soundImage.onclick = function (ev) {
            playSound(options[answer].name.toLocaleLowerCase());
        };
        const optionContainer = document.createElement('div');
        optionContainer.classList.add('option-container');
        optionContainer.appendChild(soundImage);
        optionContainer.appendChild(button);
        answersOptions.appendChild(optionContainer);
    });
};

const checkAnswer = (answer) => {
    console.log(answer.value);
    if (answer.value === options[currentOption].name) {
        answer.classList.add('correct-answer');
        rollButton.style.display = 'block';
    } else {
        answer.parentNode.disabled = true;
        answer.parentNode.childNodes.forEach(node => node.style.cursor = 'not-allowed'); 
        answer.classList.add('incorrect-answer');
        answer.setAttribute('src', './images/notOk.png');
    }
};


const clearAnswers = () => {
    answersContainer.style.display = 'none';
    answersOptions.innerHTML = '';
};

const roll = () => {
    clearAnswers();
    rollButton.style.display = 'none';

    const selectedOption = getRandomOption();

    const totalTime = (Math.floor(Math.random() * (maxTimeToRollInSeconds - minTimeToRollInSeconds)) + minTimeToRollInSeconds) * 1000;
    const distanceToRun = calculateDistance(selectedOption);
    const currentY = currentOption * imageSize;
    currentOption = selectedOption;
    rollImages(currentY, 0, distanceToRun, 0, totalTime);
};

const loadImages = () => {
    //have to add the first image at end to avoid a gap between the images when rolling
    const imagesToLoad = [...options, options[0]];
    imagesToLoad.forEach(option => {
        const image = document.createElement('img');
        image.src = `./images/${option.image}.jpg`;
        image.alt = option.name;
        image.width = imageSize;
        image.height = imageSize;
        image.style.display = 'block';
        roulette.appendChild(image);
    });
}

const adjustRouletteContainerSize = () => {
    rouletteContainer.style.width = `${imageSize}px`;
    rouletteContainer.style.height = `${imageSize}px`;
}

adjustRouletteContainerSize();
loadImages();
rollButton.addEventListener('click', roll);