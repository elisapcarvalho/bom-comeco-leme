document.addEventListener("DOMContentLoaded", () => {
  const options = [
    {
      id: 0,
      image: "clap-your-hands.jpg",
      text: "CLAP YOUR HANDS",
    },
    {
      id: 1,
      image: "stomp-your-feet.jpg",
      text: "STOMP YOUR FEET",
    },
    {
      id: 2,
      image: "dance.jpg",
      text: "DANCE",
    },
    {
      id: 3,
      image: "sing.jpg",
      text: "SING",
    },
    {
      id: 4,
      image: "jump.jpg",
      text: "JUMP",
    },
    {
      id: 5,
      image: "touch-the-ground.jpg",
      text: "TOUCH-THE-GROUND",
    },
  ];

  const image = document.getElementById("actionImage");

  function showImage() {
    const id = this.dataset.id;
    image.setAttribute('src', `images/${options[id].image}`);
    image.setAttribute('alt', options[id].text);
  };

  const shuffleCards = () => {
    options.sort(() => 0.5 - Math.random());

    for(let i = 0; i < options.length; i++) {
      const button = document.getElementById(`button${i+1}`);
      button.dataset.id = i;
      button.removeEventListener('click', showImage);
      button.addEventListener('click', showImage);
    };
  };

  const startGame = () => {
    shuffleCards();
  };

  startGame();
});
