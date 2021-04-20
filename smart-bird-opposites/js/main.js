const player = document.getElementById('player');
const prize = document.getElementById('prize');
const screenGame = document.getElementById('screen-game');
const footerGame = document.getElementById('footer-game');
const oppositesResult = document.getElementById('opposites');
const wallsOvercome = document.getElementById('walls-overcome');
const startGameButton = document.getElementById('startGameButton');
const goUpButton = document.getElementById('goUpButton');
const goDownButton = document.getElementById('goDownButton');

const wall = document.getElementById('wall');
const quantityOfWalls = 3;
const wall_velocity = 10;

const bird_width = 34;
const bird_height = 24;

const board_width = 767;
const board_height = 464;

const frame_rate = 1000.0 / 10.0; //10 fps
const steps_from_middle = 10;
const height_increase = 20;

const colors = [
    {
        background: "#3a3ac9",
        color: "#f5f5f5"
    },
    {
        background: "#fcfc50",
        color: "#3c3c3c"
    },
    {
        background: "#215721",
        color: "#f5f5f5"
    },
    {
        background: "#001f3f",
        color: "#f5f5f5"
    },
    {
        background: "#3e8c8c",
        color: "#f5f5f5"
    },
    {
        background: "#85144b",
        color: "#f5f5f5"
    },
    {
        background: "#b10dc9",
        color: "#f5f5f5"
    }
];

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

const quantityOfOptionsToAvoidRepeat = Math.floor(options.length * 0.9);
const optionsUsed = [];

let optionDrawn;
let bird_left;

let height;
let rotation = 0;

let game_interval;
let wallsScore;

let wall_width, wall_left, current_wall_velocity;

let wallOptions = [];

const goDown = () => {
    height += height_increase;
    rotation = 45;
};

const goUp = () => {
    height -= height_increase;
    rotation -= 45;
};

const drawPlayer = () => {
    player.style.transform = `rotate(${rotation}deg)`;
    player.style.top = `${height - (bird_height / 2)}px`;
    rotation = 0;    
};

const drawWall = () => {
    wall_left = wall_left - current_wall_velocity;
    if (wall_left < 0) {
        wall_left = board_width - wall_width;
        drawAnOption();
        createWall();
    }
    wall.style.left = `${wall_left}px`; 
};

const drawnOptions = () => {
    const tempOptions = [];
    tempOptions.push(options[optionDrawn].opposite);
    for(let i = 0; i < 2; i++) {
        let option = options[Math.floor(Math.random() * options.length)].opposite;
        while (tempOptions.indexOf(option) > -1) {
            option = options[Math.floor(Math.random() * options.length)].opposite;
        }
        tempOptions.push(option);
    }
    return tempOptions.sort(() => Math.random() - 0.5);
};

const drawnColors = () => {
    colors.sort(() => Math.random() - 0.5);
    const result = [];
    for(let i = 0; i < quantityOfWalls; i++)
        result.push(colors[i]);
    return result;
};

const createWall = () => {
    wallOptions = drawnOptions();
    const colors = drawnColors();

    wall.innerHTML = '';
    for(let i = 0; i < quantityOfWalls; i++) {
        const wallDiv = document.createElement('div');
        wallDiv.style.backgroundColor = colors[i].background;
        wallDiv.style.color = colors[i].color;
        wallDiv.innerHTML = wallOptions[i];
        wallDiv.id =  `wall-${i+1}`;
        wall.appendChild(wallDiv);
    }
    wall_width = wall.firstChild.offsetWidth;
    wall_left = board_width - wall_width;
    wall.style.left = `${wall_left}px`;
}

const drawAnOption = () => {
    optionDrawn = Math.floor(Math.random() * options.length);
    while (optionsUsed.indexOf(optionDrawn) > -1) {
        optionDrawn = Math.floor(Math.random() * options.length);
    }
    if (optionsUsed.length == quantityOfOptionsToAvoidRepeat) {
        optionsUsed.shift();
    }
    optionsUsed.push(optionDrawn);
    prize.innerHTML = options[optionDrawn].word;
};

const createPlayer = () => {
    player.style.width = `${bird_width}px`;
    player.style.height = `${bird_height}px`;
    bird_left = 15;
    player.style.left = `${bird_left}px`;
    height = (board_height - bird_height) / 2;
    player.style.top = `${height - (bird_height / 2)}px`;
};

const getWallHitedByPlayer = () => {
    const playerTop = parseInt(player.style.top.substr(0, player.style.top.length - 2));

    let wallBottom = 0;
    let currentWall = 0;
    let found = false;
    while (!found) {
        let currentWallHeight = document.getElementById(`wall-${currentWall + 1}`).offsetHeight;
        wallBottom += currentWallHeight;
        found =  playerTop < wallBottom;
        if (!found) {
            currentWall++;
        }
    }
    return currentWall;
}

const checkIfBirdIsAlive = () => {
    if (bird_left + bird_width === wall_left) {
        const wallHited = getWallHitedByPlayer();
        if (options[optionDrawn].opposite != wallOptions[wallHited]) {
            oppositesResult.innerHTML = `${options[optionDrawn].word} é o oposto de ${options[optionDrawn].opposite}`
            stopGame();
        } else {
            const wallToHide = document.getElementById(`wall-${wallHited + 1}`);
            wallToHide.style.visibility = 'hidden';
            wallsScore++;
            if (wallsScore % options.length === 0) {
                current_wall_velocity = Math.floor(current_wall_velocity * 1.1);
                calculateBirdPosition();
            }
            updateScore();
        }
    }
};

const calculateBirdPosition = () => {
    const spaceToWallRun = board_width - wall_width;
    const spaceFromLeft = (spaceToWallRun % current_wall_velocity) + (5 * current_wall_velocity);
    bird_left = spaceFromLeft - bird_width;
    player.style.left = `${bird_left}px`;
};

const updateScore = () => {
    wallsOvercome.textContent = wallsScore;
};

const stopAnimation = () => {
    player.style.animation = "";
    screenGame.style.animation = "";
    footerGame.style.animation = "";
};

const startAnimation = () => {
    player.style.animation = "animBird 300ms steps(4) infinite";
    screenGame.style.animation = "animSky 7s linear infinite";
    footerGame.style.animation = "animLand 2516ms linear infinite";
};

const stopGame = () => {
    clearInterval(game_interval);
    stopAnimation();
    startGameButton.style.visibility = 'visible';
};

const startGame = () => {
    oppositesResult.innerHTML = '';
    startGameButton.style.visibility = 'hidden';
    wallsScore = 0;
    current_wall_velocity = wall_velocity;

    drawAnOption();
    createWall();
    updateScore();
    calculateBirdPosition();
    createPlayer();
    startAnimation();
    
    game_interval = setInterval(() => {
        drawPlayer();
        drawWall();
        checkIfBirdIsAlive();
    }, frame_rate);    
};

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && (height + height_increase + bird_height < board_height)) {
        goDownButton.click();
    } else if (e.key === 'ArrowUp'&& (height - height_increase - (bird_height / 2) > 0)) {
        goUpButton.click();
    }
   
    return false;
});

goUpButton.addEventListener('click', goUp);
goDownButton.addEventListener('click', goDown);
startGameButton.addEventListener('click', startGame);

createPlayer();