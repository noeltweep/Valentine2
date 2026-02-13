const messages = [
  "hey!",
  "I was going to send a normal text… but you don’t deserve normal.",
  "so I made this little thing instead. because you are worth extra effort.",
  "i've been meaning to ask...",
  "will you be my valentine?"
];

let idx = 0;
let noBtnClickCount = 0;

const contentDiv = document.getElementById('content');
const fireworks = document.getElementById('fireworks');

// Animate a message word by word, then show button(s)
function animateMessage(msg, callbackToShowButton) {
  const words = msg.split(' ');
  contentDiv.innerHTML = `<div class="message"></div>`;
  const messageDiv = contentDiv.querySelector('.message');
  let i = 0, display = '';

  function revealNextWord() {
    display += (i === 0 ? '' : ' ') + words[i];
    messageDiv.textContent = display;
    i++;
    if (i < words.length) {
      setTimeout(revealNextWord, 150);
    } else if (callbackToShowButton) {
      callbackToShowButton();
    }
  }
  revealNextWord();
}

// Show the next message with animation and continue button
function showNextMessage() {
  if (idx < messages.length - 1) {
    animateMessage(messages[idx], () => {
      // Now add the "Click me to continue" button below the message, not overwriting it
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.innerText = 'Click me to continue';
      btn.onclick = showNextMessage;
      contentDiv.appendChild(btn);
      idx++;
    });
  } else {
    // Animated final message, then show Yes/No buttons
    animateMessage(messages[idx], showValentinePrompt);
  }
}

// Show Yes/No buttons
function showValentinePrompt() {
  // Add buttons below the message, cleanly
  const btnContainer = document.createElement('div');
  btnContainer.className = 'choice-btns';
  btnContainer.style.position = 'relative';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'val-btn';
  yesBtn.id = 'yesBtn';
  yesBtn.innerText = 'Yes';
  yesBtn.onclick = yesHandler;

  const noBtn = document.createElement('button');
  noBtn.className = 'val-btn';
  noBtn.id = 'noBtn';
  noBtn.innerText = 'No';
  noBtn.onclick = noHandler;

  btnContainer.appendChild(yesBtn);
  btnContainer.appendChild(noBtn);

  contentDiv.appendChild(btnContainer);

  // Reset styling
  yesBtn.style.fontSize = '1.2rem';
  noBtn.style.fontSize = '1.2rem';
  noBtn.style.position = 'absolute';
  noBtn.style.left = '0px';
  noBtn.style.top = '0px';
  noBtnClickCount = 0;
}

// Yes button handler: Love message + fireworks
function yesHandler() {
  contentDiv.innerHTML = `
    <div class="message" style="font-size:2.5rem;">she said yess!..  Divine loves you❤️</div>
  `;
  launchFireworks();
}

// No button handler: Moves anywhere & grows Yes button
function noHandler() {
  noBtnClickCount++;

  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  // Move No button anywhere on screen
  const minX = 0, minY = 0;
  const maxX = window.innerWidth - btnWidth;
  const maxY = window.innerHeight - btnHeight - 40;

  const randX = Math.floor(Math.random() * (maxX - minX)) + minX;
  const randY = Math.floor(Math.random() * (maxY - minY)) + minY;

  noBtn.style.position = 'fixed';
  noBtn.style.left = `${randX}px`;
  noBtn.style.top = `${randY}px`;
  noBtn.style.transition = 'all 0.2s';

  // Yes button grows
  let scale = 1 + noBtnClickCount; // Each click increases 1x
  if (scale > 15) scale = 15; // 15 clicks to cover screen
  yesBtn.style.fontSize = `${1.2 * scale}rem`;

  if (scale >= 15) {
    // Yes button covers everything, No disappears
    yesBtn.style.position = 'fixed';
    yesBtn.style.left = '50%';
    yesBtn.style.top = '50%';
    yesBtn.style.transform = 'translate(-50%, -50%) scale(20)';
    yesBtn.style.zIndex = '10';
    noBtn.style.display = 'none';
    yesBtn.textContent = "YES!";
  }
}

// Initial render
showNextMessage();

// Fireworks effect (simple confetti)
function launchFireworks() {
  fireworks.style.display = 'block';
  const ctx = fireworks.getContext('2d');
  fireworks.width = window.innerWidth;
  fireworks.height = window.innerHeight;
  let particles = [];
  let colors = ['#e75480','#fff0f6','#ffb347','#8ef6e6','#ff5e5e'];
  let timer = 0;

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: fireworks.width/2,
      y: fireworks.height/2,
      angle: Math.random()*2*Math.PI,
      speed: Math.random()*5+4,
      color: colors[Math.floor(Math.random()*colors.length)],
      radius: Math.random()*6+4
    });
  }

  function animate() {
    ctx.clearRect(0,0,fireworks.width,fireworks.height);
    particles.forEach(p => {
      p.x += Math.cos(p.angle)*p.speed;
      p.y += Math.sin(p.angle)*p.speed;
      p.radius *= 0.98;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2*Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    timer++;
    if (timer < 60) {
      requestAnimationFrame(animate);
    } else {
      fireworks.style.display = 'none';
    }
  }
  animate();
}