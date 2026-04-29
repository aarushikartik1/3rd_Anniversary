if (history.scrollRestoration) { history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);

// --- 0. Shared Elements ---
const enterScreen = document.getElementById('enter-screen');
const bgMusic = document.getElementById('bg-music');
const volumeContainer = document.getElementById('volume-container');
const daysCounter = document.getElementById('days-counter');

document.body.classList.add('locked');

// --- 1. PIN Lock Logic ---
const CORRECT_PIN = "1205";
let enteredPin = "";

const entryText = document.getElementById('entry-text');
const pinScreen = document.getElementById('pin-screen');
const pinDots = document.querySelectorAll('.pin-dot');
const numBtns = document.querySelectorAll('.num-btn');

// Click text to reveal PIN Pad
entryText.addEventListener('click', (e) => {
    e.stopPropagation(); 
    entryText.classList.add('hidden');
    setTimeout(() => {
        entryText.style.display = 'none';
        pinScreen.classList.remove('hidden');
    }, 400); 
});

// Numpad Logic
numBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = btn.getAttribute('data-val');

        if (val === 'C') {
            enteredPin = "";
        } else if (val === 'B') {
            enteredPin = enteredPin.slice(0, -1);
        } else if (enteredPin.length < 4) {
            enteredPin += val;
        }

        updatePinDisplay();

        if (enteredPin.length === 4) {
            setTimeout(checkPin, 200); 
        }
    });
});

function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
        if (index < enteredPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function checkPin() {
    if (enteredPin === CORRECT_PIN) {
        // UNLOCK SUCCESS
        bgMusic.volume = volumeSlider.value; 
        bgMusic.play().catch(error => console.log("Audio play failed:", error));
        enterScreen.classList.add('hidden');
        document.body.classList.remove('locked');
        volumeContainer.classList.remove('hidden');
        daysCounter.classList.remove('hidden'); 
    } else {
        // ERROR SHAKE
        const dotContainer = document.querySelector('.pin-display');
        dotContainer.classList.add('error');
        setTimeout(() => {
            dotContainer.classList.remove('error');
            enteredPin = "";
            updatePinDisplay();
        }, 400); 
    }
}

// --- 2. Volume Logic ---
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');

volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value;
    bgMusic.volume = vol;
    if (vol == 0) {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
    } else {
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
    }
});

let lastVolume = 0.5;
muteBtn.addEventListener('click', () => {
    if (bgMusic.volume > 0) {
        lastVolume = bgMusic.volume; 
        bgMusic.volume = 0;
        volumeSlider.value = 0;
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
    } else {
        bgMusic.volume = lastVolume > 0 ? lastVolume : 0.5; 
        volumeSlider.value = bgMusic.volume;
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
    }
});

// --- 3. Magical Dust Particles ---
const particlesContainer = document.getElementById('particles');
const colors = ['#ffffff', '#fff0f3', '#ffb3ba', '#fce4ec']; 

for (let i = 0; i < 80; i++) { 
    const star = document.createElement('div');
    star.className = 'star';
    star.style.background = colors[Math.floor(Math.random() * colors.length)];
    star.style.left = `${Math.random() * 200}vw`; 
    star.style.top = `${Math.random() * 100}vh`;
    const size = Math.random() * 3 + 1; 
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.filter = `blur(${Math.random() * 1.5}px)`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${Math.random() * 4 + 5}s`;
    particlesContainer.appendChild(star);
}

// --- 4. Smooth Scroll Logic ---
let targetScroll = 0;
let currentScroll = 0;
const ease = 0.08;
const track = document.getElementById('timeline-track');
const startText = document.querySelector('.start-text');
const endText = document.querySelector('.end-text');
const wrapper = document.getElementById('sticky-wrapper');
const tabsContainer = document.getElementById('overlay-tabs');

window.addEventListener('scroll', () => { targetScroll = window.scrollY; });

function render() {
    currentScroll += (targetScroll - currentScroll) * ease;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (maxScroll > 0) {
        const scrollRatio = currentScroll / maxScroll;
        const maxTranslate = track.scrollWidth - window.innerWidth;
        const translateX = -(scrollRatio * maxTranslate);
        
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        particlesContainer.style.transform = `translate3d(${translateX * 0.15}px, 0, 0)`;

        if (currentScroll > 150) { tabsContainer.classList.add('visible'); } 
        else { tabsContainer.classList.remove('visible'); }

        let trackOpacity = 1;

        if (scrollRatio <= 0.05) {
            const startProgress = scrollRatio / 0.05; 
            startText.style.opacity = 1 - startProgress;
            startText.style.filter = `blur(${startProgress * 10}px)`;
            trackOpacity = startProgress; 
        } else if (scrollRatio > 0.8) {
            startText.style.opacity = 0;
            const fadeOutRatio = 1 - ((scrollRatio - 0.8) * 5); 
            trackOpacity = Math.max(0.1, fadeOutRatio); 
        } else {
            startText.style.opacity = 0;
            trackOpacity = 1;
        }

        track.style.opacity = trackOpacity;

        if (scrollRatio > 0.85) {
            const textProgress = Math.min((scrollRatio - 0.85) / 0.15, 1); 
            endText.style.opacity = textProgress;
            endText.style.filter = `blur(${10 - (textProgress * 10)}px)`; 
        } else {
            endText.style.opacity = 0;
            endText.style.filter = 'blur(10px)';
        }
    }
    requestAnimationFrame(render);
}
render();

// --- 5. Camera Roll Logic ---
const slideshowContainer = document.getElementById('slideshow-container');
const totalImages = 20;
let currentSlide = 0;
let slideInterval; 

for(let i = 1; i <= totalImages; i++) {
    const img = document.createElement('img');
    img.src = `assets/${i}.png`; 
    img.alt = `Memory ${i}`;
    if(i === 1) img.classList.add('active');
    slideshowContainer.appendChild(img);
}

const slides = slideshowContainer.querySelectorAll('img');
const counterText = document.getElementById('current-slide-num');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalImages; 
    slides[currentSlide].classList.add('active');
    counterText.innerText = currentSlide + 1;
}

function prevSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + totalImages) % totalImages; 
    slides[currentSlide].classList.add('active');
    counterText.innerText = currentSlide + 1;
}

nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

function startTimer() { slideInterval = setInterval(nextSlide, 5000); }
function resetTimer() { clearInterval(slideInterval); startTimer(); }

// --- 6. Tab Logic ---
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        const targetId = e.target.dataset.target;
        panels.forEach(p => p.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        wrapper.style.opacity = '0.3';

        if (targetId === 'panel-gallery') { resetTimer(); } 
        else { clearInterval(slideInterval); }
    });
});

panels.forEach(panel => {
    panel.addEventListener('click', (e) => {
        if (e.target === panel || e.target.classList.contains('close-btn')) {
            panel.classList.remove('active');
            wrapper.style.opacity = '1';
            clearInterval(slideInterval);
        }
    });
});

// --- 7. Dynamic Days Counter Logic ---
const startDate = new Date('2023-05-12T00:00:00'); 
const today = new Date();
const diffTime = Math.abs(today - startDate);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
document.getElementById('days-count').innerText = diffDays;

// --- 8. Secret Diamond Logic ---
const secretDiamond = document.getElementById('secret-diamond');
const secretMessage = document.getElementById('secret-message');

if (secretDiamond && secretMessage) {
    secretDiamond.addEventListener('click', (e) => {
        e.stopPropagation(); 
        secretMessage.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!secretDiamond.contains(e.target)) {
            secretMessage.classList.remove('show');
        }
    });
}