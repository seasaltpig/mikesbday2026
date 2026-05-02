const view1 = document.getElementById('view1');
const view2 = document.getElementById('view2');
const view3 = document.getElementById('view3');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const audio = document.getElementById('audio');
const confettiContainer = document.getElementById('confetti-container');
const ytFrame = document.getElementById('ytFrame');

let audioCtx, analyser, source, dataArray;
let confettiRunning = false;

/* View switching */
function switchView(from, to) {
  from.classList.remove('active');
  setTimeout(() => {
    from.classList.add('hidden');
    to.classList.remove('hidden');
    setTimeout(() => to.classList.add('active'), 20);
  }, 300);
}

/* AUDIO SETUP */
function setupAudioAnalysis() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

/* CONFETTI */
function spawnConfetti(count = 10) {
  const colors = ['#00FF00', '#FFFFFF', '#39FF14', '#66FF66'];

  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.classList.add('confetti');

    div.style.left = Math.random() * 100 + 'vw';
    div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    const size = Math.random() * 6 + 4;
    div.style.width = size + 'px';
    div.style.height = size * 1.5 + 'px';

    div.style.animationDuration = (Math.random() * 2 + 2) + 's';

    confettiContainer.appendChild(div);

    setTimeout(() => div.remove(), 5000);
  }
}

/* AUDIO REACTIVE LOOP */
function startReactiveConfetti() {
  if (confettiRunning) return;
  confettiRunning = true;

  function loop() {
    if (!confettiRunning) return;

    analyser.getByteFrequencyData(dataArray);

    // Get average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    let avg = sum / dataArray.length;

    // Map volume → confetti amount
    let intensity = Math.floor(avg / 10); // tweak sensitivity here

    spawnConfetti(intensity);

    requestAnimationFrame(loop);
  }

  loop();
}

function stopConfetti() {
  confettiRunning = false;
  confettiContainer.innerHTML = '';
}

/* START */
startBtn.addEventListener('click', async () => {
  try {
    setupAudioAnalysis();

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    audio.currentTime = 0;
    await audio.play();
  } catch (err) {
    console.error("Audio failed:", err);
  }

  startReactiveConfetti();
  switchView(view1, view2);
});

/* GO TO VIDEO */
function goToVideo() {
  audio.pause();
  stopConfetti();

  ytFrame.src = "https://www.youtube.com/embed/fSwLvSLV3ZE?autoplay=1&mute=0&playsinline=1";
  switchView(view2, view3);
}

view2.addEventListener('click', goToVideo);
audio.addEventListener('ended', goToVideo);

/* RESTART */
restartBtn.addEventListener('click', () => {
  ytFrame.src = "";
  switchView(view3, view1);
});

/* INIT ICONS */
lucide.createIcons();
