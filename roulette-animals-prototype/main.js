const options = [
    {
        text: 'DOG',
        image: './images/dog.jpg',
        rouletteText: ['DOG'],
        color: 'red',
        textColor: 'white'
    },
    {
        text: 'CAT',
        image: './images/cat.jpg',
        rouletteText: ['CAT'],
        color: 'orange',
        textColor: 'black'
    },
    {
        text: 'FISH',
        image: './images/fish.jpg',
        rouletteText: ['FISH'],
        color: 'yellow',
        textColor: 'black'
    },
    {
        text: 'BIRD',
        image: './images/bird.jpg',
        rouletteText: ['BIRD'],
        color: 'green',
        textColor: 'white'
    },
    {
        text: 'RABBIT',
        image: './images/rabbit.jpg',
        rouletteText: ['RABBIT'],
        color: 'blue',
        textColor: 'white'
    }
];

const canvasSize = 500;
const halfCanvasSize = canvasSize / 2;
const minSpinAngle = 0.12;

const imagesContainer = document.getElementById('images');
const selectedMimeText = document.getElementById('selectedMime');
const spinButton = document.getElementById('spinButton');

const canvas = document.getElementById('canvas');
canvas.setAttribute('width', canvasSize);
canvas.setAttribute('height', canvasSize);

const outsideRadius = Math.floor(canvasSize * 0.4);
const textRadius = Math.floor(canvasSize * 0.3);
const insideRadius = 0;

let startAngle = 0;
const arc = Math.PI / (options.length / 2);

let spinStartAngle = 0;
let spinTime = 0;
let spinTimeTotal = 0;

let spinTimeout;
let ctx;

const spinRoulette = () => {
    imagesContainer.innerHTML = '';
    selectedMimeText.innerHTML = '';
    spinButton.style.display = 'none';

    spinStartAngle = Math.random() * 10 + 10;
    spinTimeTotal = (Math.random() * 5 + 5) * 1000;
    spinTime = 0;

    rotateWheel();
};

const rotateWheel = () => {
    spinTime += 30;
    const spinAngle = spinStartAngle - easeOut(spinTime, 0, spinStartAngle, spinTimeTotal);

    if (spinTime >= spinTimeTotal || spinAngle < minSpinAngle) {
        stopRotateWheel();
        return;
    }

    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

const stopRotateWheel = () => {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    showOptions(index);
}

const createArrayOfOptions = (index) => {
    const randomOptions = [index];
    let randomOption;
    while (randomOptions.length < 3) {
        do  {
            randomOption = Math.floor(Math.random() * options.length);
        } while(randomOptions.indexOf(randomOption) > -1);
        randomOptions.push(randomOption);
    }
    randomOptions.sort(() => Math.random() - 0.5);
    return randomOptions;
};

checkIfSelectionIsCorrect = button => {
    if(button.getAttribute('data-correct') === 'true') {
        button.classList.add('optionCorrect');
        selectedMimeText.innerHTML = button.getAttribute('alt');
        spinButton.style.display = 'block';
    } else {
        selectedMimeText.innerHTML = 'Oh no! Try again!'
        button.classList.add('optionIncorrect');
    }
};
const showOptions = (index) => {
    const optionsToShow = createArrayOfOptions(index);

    optionsToShow.forEach(opt => {
        const imageButton = document.createElement('input');
        imageButton.setAttribute('type', 'image');
        imageButton.setAttribute('src', options[opt].image);
        imageButton.setAttribute('alt', options[opt].text);
        imageButton.setAttribute('data-correct', opt === index);        
        imageButton.classList.add('optionButton');
        imageButton.onclick = function (ev) {
            ev.preventDefault();
            checkIfSelectionIsCorrect(this);
        };
        imagesContainer.appendChild(imageButton);
    })
};

const drawRouletteWheel = () => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = 'bold 16px Helvetica, Arial';

    for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = options[i].color;

        ctx.beginPath();
        ctx.arc(halfCanvasSize, halfCanvasSize, outsideRadius, angle, angle + arc, false);
        ctx.arc(halfCanvasSize, halfCanvasSize, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.fillStyle = options[i].textColor;
        ctx.translate(
            halfCanvasSize + Math.cos(angle + arc / 2) * textRadius,
            halfCanvasSize + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        let line = 0;
        let lineHeight = 20;
        options[i].rouletteText.forEach(text => {
            ctx.fillText(text, -ctx.measureText(text).width / 2, line);
            line += lineHeight;
        })
        ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(halfCanvasSize - 6, halfCanvasSize - (outsideRadius + 8));
    ctx.lineTo(halfCanvasSize + 6, halfCanvasSize - (outsideRadius + 8));
    ctx.lineTo(halfCanvasSize + 6, halfCanvasSize - (outsideRadius - 8));
    ctx.lineTo(halfCanvasSize + 13, halfCanvasSize - (outsideRadius - 8));
    ctx.lineTo(halfCanvasSize + 0, halfCanvasSize - (outsideRadius - 19));
    ctx.lineTo(halfCanvasSize - 13, halfCanvasSize - (outsideRadius - 8));
    ctx.lineTo(halfCanvasSize - 6, halfCanvasSize - (outsideRadius - 8));
    ctx.lineTo(halfCanvasSize - 6, halfCanvasSize - (outsideRadius + 8));
    ctx.fill();
};

const easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

if (canvas.getContext) {
    spinButton.addEventListener('click', spinRoulette);
    ctx = canvas.getContext('2d');
    drawRouletteWheel();
} else {
    console.log('Cant draw roulette');
}

