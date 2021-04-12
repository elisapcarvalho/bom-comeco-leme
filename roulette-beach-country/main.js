const options = [
    {
        name: 'sea',
        image: 'sea',
        location: 'beach'
    },
    {
        name: 'sand',
        image: 'sand',
        location: 'beach'
    },
    {
        name: 'waves',
        image: 'waves',
        location: 'beach'
    },
    {
        name: 'island',
        image: 'island',
        location: 'beach'
    },
    {
        name: 'lifeguard',
        image: 'lifeguard',
        location: 'beach'
    },
    {
        name: 'suntan lotion',
        image: 'suntan',
        location: 'beach'
    },
    {
        name: 'umbrella',
        image: 'umbrella',
        location: 'beach'
    },
    {
        name: 'towel',
        image: 'towel',
        location: 'beach'
    },
    {
        name: 'sunglasses',
        image: 'sunglasses',
        location: 'beach'
    },
    {
        name: 'shells',
        image: 'shells',
        location: 'beach'
    },
    {
        name:'road',
        image: 'road',
        location: 'country'
    },
    {
        name:'farm house',
        image: 'house',
        location: 'country'
    },
    {
        name:'horse',
        image: 'horse',
        location: 'country'
    },
    {
        name:'cow',
        image: 'cow',
        location: 'country'
    },
    {
        name:'pig',
        image: 'pig',
        location: 'country'
    },
    {
        name:'hen',
        image: 'hen',
        location: 'country'
    },
    {
        name:'fruit tree',
        image: 'tree',
        location: 'country'
    },
    {
        name:'flowers',
        image: 'flowers',
        location: 'country'
    },
    {
        name:'tractor',
        image: 'tractor',
        location: 'country'
    },
    {
        name:'lake',
        image: 'lake',
        location: 'country'
    },
];

const animationInterval = 30;
const imageSize = 200;
const maxNumberOfLoops = 10;
const maxTimeToRollInSeconds = 7;
const minTimeToRollInSeconds = 2;
const quantityOfImagesToNotRepeat = Math.floor(options.length * .95);
const quantityOfOptionsToAnswer = 4;
const rouletteHeight = options.length * imageSize;

const usedImages = [];
const optionsToAnswer = [];

let currentOption = 0;
let currentTimeout;

const rollButton = document.getElementById("rollButton");
const roulette = document.getElementById("roulette");
const rouletteContainer = document.getElementById("roulette-container");
const answersContainer = document.getElementById("answers-container");
const answersOptions = document.getElementById("answers-options");
const whereContainer = document.getElementById("where-container")
const whereOptions = document.getElementById("where-options");

const getRandomOption = () => {
    const optionsQuantity = options.length;
    let sortedIndex = Math.floor(Math.random() * optionsQuantity);
    while(usedImages.indexOf(sortedIndex) > -1) {
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

const displayOptionsToAnswer = () => {
    answersContainer.style.display = 'grid';
    answersOptions.innerHTML = '';
    optionsToAnswer.sort(() => 0.5 - Math.random());
    optionsToAnswer.forEach(answer => {
        const option = document.createElement('button');
        option.classList.add('answer-option');
        option.innerHTML = options[answer].name.toLocaleUpperCase();
        option.value = options[answer].name;
        option.style.cursor = "pointer";
        option.addEventListener('click', function () {
            checkAnswer(this);
        });
        answersOptions.appendChild(option);
    });
};

const askWhereCanFind = () => {
    whereContainer.style.display = 'block';
    whereOptions.innerHTML = '';
    ['beach', 'country'].forEach(answer => {
        const option = document.createElement('button');
        option.classList.add('answer-option');
        option.innerHTML = answer.toLocaleUpperCase();
        option.value = answer;
        option.style.cursor = "pointer";
        option.addEventListener('click', function () {
            checkWhereAnswer(this);
        });
        whereOptions.appendChild(option);
    });
};

const checkAnswer = (answer) => {
    if (answer.value === options[currentOption].name) {
        answer.classList.add('correct-answer');
        askWhereCanFind();
    } else {
        answer.classList.add('incorrect-answer');
    }
};

const checkWhereAnswer = (answer) => {
    if (answer.value === options[currentOption].location) {
        answer.classList.add('correct-answer');
        rollButton.style.display = 'block';
    } else {
        answer.classList.add('incorrect-answer');
    }
};

const displayResult = () => {
    clearTimeout(currentTimeout);
    const desiredY = currentOption * imageSize;
    roulette.style.transform = `translate(0px, -${desiredY}px)`;
    displayOptionsToAnswer();
}

const generateOptionsToAnswer = (selected) => {
    optionsToAnswer.length = 0;
    optionsToAnswer.push(selected);
    for(let i = 1; i < quantityOfOptionsToAnswer; i++) {
        let option = Math.floor(Math.random() * options.length);
        while (optionsToAnswer.indexOf(option) > -1) {
            option = Math.floor(Math.random() * options.length);
        }
        optionsToAnswer.push(option);
    }
};

const clearAnswers = () => {
    answersContainer.style.display = 'none';
    answersOptions.innerHTML = '';
    whereContainer.style.display = 'none';
    whereOptions.innerHTML = '';
};

const roll = () => {
    clearAnswers();
    rollButton.style.display = 'none';

    const selectedOption = getRandomOption();
    generateOptionsToAnswer(selectedOption);

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