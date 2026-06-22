const rootElement = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const typewriter = document.querySelector('.typewriter');
const typewriterText = document.querySelector('.typewriter-text');
const aboutCopy = document.querySelector('.about-copy');
const aboutResetTarget = document.querySelector('.about-reset-target');
const hobbyButtons = Array.from(document.querySelectorAll('.hobby-pill'));

const hobbyCopy = {
    soccer: 'Soccer keeps me focused on competition, improvement, and staying calm while pushing for better performance.',
    python: 'Python and coding are where I like turning ideas into small experiments and learning by building.',
    math: 'Math and physics give me the logic side of things, helping me connect theory to how the real world works.',
    chess: 'Chess reflects how I like to think ahead, stay patient, and solve problems with strategy.',
    piano: 'Piano fits my interest in discipline, pattern recognition, and building consistency over time.',
    cooking: 'Cooking and baking give me a creative process to follow while staying precise enough to get good results.'
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
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        // Ignore storage failures so the toggle still works in restricted environments.
    }
}

function toggleTheme() {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
}

function initThemeToggle() {
    if (!themeToggle) {
        return;
    }

    if (!rootElement.hasAttribute('data-theme')) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }

    themeToggle.addEventListener('click', toggleTheme);
}

function initTypewriter() {
    if (!typewriter || !typewriterText) {
        return;
    }

    const fullText = normalizeText(typewriterText.dataset.text || typewriterText.textContent || '');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!fullText) {
        return;
    }

    if (prefersReducedMotion) {
        typewriterText.textContent = fullText;
        typewriter.classList.add('is-done');
        return;
    }

    typewriter.classList.add('is-typing');
    typewriterText.textContent = '';

    let currentIndex = 0;
    const typingDelay = 45;
    const startDelay = 150;

    function writeNextCharacter() {
        typewriterText.textContent = fullText.slice(0, currentIndex);
        currentIndex += 1;

        if (currentIndex <= fullText.length) {
            window.setTimeout(writeNextCharacter, typingDelay);
        } else {
            window.setTimeout(() => {
                typewriter.classList.remove('is-typing');
                typewriter.classList.add('is-done');
            }, 450);
        }
    }

    window.setTimeout(writeNextCharacter, startDelay);
}

function setActiveHobby(activeButton) {
    hobbyButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

let aboutSwapTimeout = null;
const defaultAboutText = aboutCopy ? normalizeText(aboutCopy.textContent || '') : '';

function swapAboutText(nextText) {
    if (!aboutCopy || !nextText) {
        return;
    }

    if (aboutSwapTimeout) {
        window.clearTimeout(aboutSwapTimeout);
    }

    if (normalizeText(aboutCopy.textContent || '') === nextText) {
        return;
    }

    aboutCopy.classList.add('is-fading');
    aboutSwapTimeout = window.setTimeout(() => {
        aboutCopy.textContent = nextText;
        aboutCopy.classList.remove('is-fading');
        aboutSwapTimeout = null;
    }, 240);
}

function resetAbout() {
    if (!aboutCopy) {
        return;
    }

    swapAboutText(defaultAboutText);
    setActiveHobby(null);
}

function initAboutInteractions() {
    if (!aboutCopy) {
        return;
    }

    hobbyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const hobbyKey = button.dataset.hobby;
            const nextText = hobbyCopy[hobbyKey];

            if (!nextText) {
                return;
            }

            setActiveHobby(button);
            swapAboutText(nextText);
        });
    });

    if (aboutResetTarget) {
        aboutResetTarget.addEventListener('click', resetAbout);
        aboutResetTarget.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                resetAbout();
            }
        });
    }
}

initThemeToggle();
initTypewriter();
initAboutInteractions();
