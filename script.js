const rootElement = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const typewriter = document.querySelector('.typewriter');
const typewriterText = document.querySelector('.typewriter-text');
const aboutCopy = document.querySelector('.about-copy');
const aboutResetTarget = document.querySelector('.about-reset-target');
const hobbyButtons = Array.from(document.querySelectorAll('.hobby-pill'));

const hobbyCopy = {
    soccer: "Soccer has been part of my life since I was 6, and over time it’s shaped me far beyond just competition. Playing in a team environment helped me develop communication skills, learn how to coordinate with others under pressure, and understand how small decisions affect the bigger game.",
    python: "Python and coding are where I like turning ideas into small experiments and learning by building.",
    math: "Math and physics give me the logic side of things, helping me connect theory to how the real world works.",
    chess: "Chess reflects how I like to think ahead, stay patient, and solve problems with strategy.",
    piano: "Piano fits my interest in discipline, pattern recognition, and building consistency over time.",
    cooking: "Cooking and baking give me a creative process to follow while staying precise enough to get good results."
};

function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function getCurrentTheme() {
    return rootElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
    if (theme === 'dark') {
        rootElement.setAttribute('data-theme', 'dark');
    } else {
        rootElement.removeAttribute('data-theme');
    }

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
    }

    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
}

function initThemeToggle() {
    if (!themeToggle) return;
    applyTheme(localStorage.getItem('theme') || 'light');
    themeToggle.addEventListener('click', toggleTheme);
}

function initTypewriter() {
    if (!typewriter || !typewriterText) return;

    const fullText = typewriterText.dataset.text || typewriterText.textContent;
    typewriterText.textContent = "";

    let i = 0;
    const speed = 45;

    function type() {
        if (i < fullText.length) {
            typewriterText.textContent += fullText.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

function setActiveHobby(activeButton) {
    hobbyButtons.forEach(btn => {
        btn.classList.toggle('is-active', btn === activeButton);
    });
}

let aboutSwapTimeout = null;
const defaultAboutText = aboutCopy ? aboutCopy.textContent : "";

function swapAboutText(text) {
    if (!aboutCopy) return;

    clearTimeout(aboutSwapTimeout);

    aboutCopy.classList.add('is-fading');

    aboutSwapTimeout = setTimeout(() => {
        aboutCopy.textContent = text;
        aboutCopy.classList.remove('is-fading');
    }, 200);
}

function resetAbout() {
    swapAboutText(defaultAboutText);
    setActiveHobby(null);
}

function initAboutInteractions() {
    hobbyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.hobby;
            if (!hobbyCopy[key]) return;

            setActiveHobby(button);
            swapAboutText(hobbyCopy[key]);
        });
    });

    if (aboutResetTarget) {
        aboutResetTarget.addEventListener('click', resetAbout);
    }
}

initThemeToggle();
initTypewriter();
initAboutInteractions();