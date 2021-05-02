const options = [
    {
        word: 'Slow',
        opposite: 'Fast'
    },
    {
        word: 'Dark',
        opposite: 'Light'
    },
    {
        word: 'Healthy',
        opposite: 'Sick'
    },
    {
        word: 'Rich',
        opposite: 'Poor'
    },
    {
        word: 'Good',
        opposite: 'Bad'
    },
    {
        word: 'Dirty',
        opposite: 'Clean'
    },
    {
        word: 'Cheap',
        opposite: 'Expensive'
    },
    {
        word: 'Empty',
        opposite: 'Full'
    },
    {
        word: 'Strong',
        opposite: 'Weak'
    },
    {
        word: 'Easy',
        opposite: 'Difficult'
    },
    {
        word: 'Hard',
        opposite: 'Soft'
    },
    {
        word: 'Near',
        opposite: 'Far'
    },
];

const animationInterval = 30;
const optionContainerSize = 200;
const maxNumberOfLoops = 10;
const maxTimeToRollInSeconds = 7;
const minTimeToRollInSeconds = 2;
const quantityOfOptionsToNotRepeat = Math.floor(options.length * .95);
const quantityOfOptionsToAnswer = 3;
const rouletteHeight = options.length * optionContainerSize;

const usedOptions = [];

let currentOption = 0;
let currentTimeout;

const rollButton = document.getElementById("rollButton");
const roulette = document.getElementById("roulette");
const rouletteContainer = document.getElementById("roulette-container");
const answersContainer = document.getElementById("answers-container");
const answersOptions = document.getElementById("answers-options");


const getRandomOption = () => {
    const optionsQuantity = options.length;
    let sortedIndex;
    
    do  {
        sortedIndex = Math.floor(Math.random() * optionsQuantity);
    } while (usedOptions.indexOf(sortedIndex) > -1);
    
    const usedTipsLength = usedOptions.push(sortedIndex);
    if (usedTipsLength > quantityOfOptionsToNotRepeat) {
        usedOptions.splice(0, 1);
    }
    return sortedIndex;
};

const calculateDistance = (stopIndex) => {
    const loops = Math.ceil(Math.random() * maxNumberOfLoops);
    const optionsToCompleteTheCurrentLoop = options.length - currentOption;
    const optionsToCompleteTheLastLoop = stopIndex;

    return ((loops * options.length) + optionsToCompleteTheCurrentLoop + optionsToCompleteTheLastLoop) * optionContainerSize;
}

const slowdown = (current, distance, total) => {
    //using function easeOutQuart from https://easings.net/
    const x = current / total;
    const factor = 1 - Math.pow(1 - x, 4);
    return distance * factor;
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

const displayOptionsToAnswer = () => {
    answersContainer.style.display = 'grid';
    answersOptions.innerHTML = '';
    const optionsToAnswer = generateOptionsToAnswer();
    optionsToAnswer.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('answer-option');
        button.innerHTML = options[answer].opposite;
        button.addEventListener('click', function () {
            checkAnswer(this);
        });
        answersOptions.appendChild(button);
    });
};

const displayResult = () => {
    clearTimeout(currentTimeout);
    const desiredY = currentOption * optionContainerSize;
    roulette.style.transform = `translate(0px, -${desiredY}px)`;
    displayOptionsToAnswer();
}

const rollOptions = (currentY, distanceRunned, distanceToRun, currentTime, totalTime) => {
    currentTime += animationInterval;
    const slowDownFactor = slowdown(currentTime, distanceToRun, totalTime);
    if ((totalTime < currentTime) || ((distanceToRun - slowDownFactor) < 0.04)) {
        displayResult();
    } else {
        currentY = (currentY + (slowDownFactor - distanceRunned)) % rouletteHeight;
        distanceRunned = slowDownFactor;
        roulette.style.transform = `translate(0px, -${currentY}px)`;
        currentTimeout = setTimeout(() => {
            rollOptions(currentY, distanceRunned, distanceToRun, currentTime, totalTime);
        }, animationInterval);
    }
}

const checkAnswer = (answer) => {
    if (answer.innerHTML === options[currentOption].opposite) {
        answer.classList.add('correct-answer');
        rollButton.style.display = 'block';
    } else {
        answer.classList.add('incorrect-answer');
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
    const currentY = currentOption * optionContainerSize;
    currentOption = selectedOption;
    rollOptions(currentY, 0, distanceToRun, 0, totalTime);
};

const loadOptionsToRoll = () => {
    //have to add the first image at end to avoid a gap between the images when rolling
    const optionsToLoad = [...options, options[0]];
    optionsToLoad.forEach(option => {
        const div = document.createElement('div');
        div.innerHTML = option.word;
        div.style.width = `${optionContainerSize}px`;
        div.style.height = `${optionContainerSize}px`;
        div.classList.add('option');
        roulette.appendChild(div);
    });
}

const adjustRouletteContainerSize = () => {
    rouletteContainer.style.width = `${optionContainerSize}px`;
    rouletteContainer.style.height = `${optionContainerSize}px`;
}

adjustRouletteContainerSize();
loadOptionsToRoll();
rollButton.addEventListener('click', roll);