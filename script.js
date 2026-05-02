const view1 = document.getElementById('view1');
const view2 = document.getElementById('view2');
const view3 = document.getElementById('view3');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const audio = document.getElementById('audio');
const confettiContainer = document.getElementById('confetti-container');
const ytFrame = document.getElementById('ytFrame');

function switchView(from, to) {
  from.classList.remove('active');
  setTimeout(() => {
    from.classList.add('hidden');
    to.classList.remove('hidden');
    setTimeout(() => to.classList.add('active'), 20);
  }, 300);
}

/* Confetti generator */
function createConfetti() {
  const colors = ['#00FF00', '#FFFFFF', '#39FF14', '#66FF66'];

  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.classList.add('confetti');

    div.style.left = Math.random() * 100 + 'vw';
    div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    div.style.animationDuration = (Math.random() * 3 + 2) + 's';

    confettiContainer.appendChild(div);

    setTimeout(() => div.remove(), 5000);
  }
}

function clearConfetti() {
  confettiContainer.innerHTML = '';
}

/* Start button */
startBtn.addEventListener('click', () => {
  audio.currentTime = 0;
  audio.play();

  createConfetti();
  switchView(view1, view2);
});

/* Skip or audio end */
function goToVideo() {
  audio.pause();
  clearConfetti();

  ytFrame.src = "https://www.youtube.com/embed/fSwLvSLV3ZE?autoplay=1&mute=1&playsinline=1";
  switchView(view2, view3);
}

view2.addEventListener('click', goToVideo);
audio.addEventListener('ended', goToVideo);

/* Restart */
restartBtn.addEventListener('click', () => {
  ytFrame.src = "";
  switchView(view3, view1);
});

/* Init icons */
lucide.createIcons();
