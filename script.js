const rootElement = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const typewriter = document.querySelector('.typewriter');
const typewriterText = document.querySelector('.typewriter-text');
const aboutCopy = document.querySelector('.about-copy');
const aboutResetTarget = document.querySelector('.about-reset-target');
const hobbyButtons = Array.from(document.querySelectorAll('.hobby-pill'));
const aboutTitle = document.querySelector('.about-title');

const hobbyCopy = {
    soccer: "Soccer has been part of my life since I was 6, and over time it’s shaped me far beyond just competition. Playing in a team environment helped me develop communication skills, learn how to coordinate with others under pressure, and understand how small decisions affect the bigger game.",
    python: "Python and coding are where I like turning ideas into small experiments and learning by building.",
    math: "Math and physics give me the logic side of things, helping me connect theory to how the real world works.",
    chess: "Chess reflects how I like to think ahead, stay patient, and solve problems with strategy.",
    piano: "Piano fits my interest in discipline, pattern recognition, and building consistency over time.",
    cooking: "Cooking and baking give me a creative process to follow while staying precise enough to get good results."
};

const hobbyTitle = {
    default: "Kartik",
    soccer: "A Soccer Player ",
    python: "A Developer",
    math: "A Mathematician",
    chess: "A Strategist",
    piano: "A Pianist",
    cooking: "A Chef"
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

    const fullText = typewriterText.dataset.text || "driven by curiosity.";
    typewriterText.textContent = "";

    const cursor = typewriter.querySelector('.typewriter-cursor');

    let i = 0;

    // --- blink twice ---
    function blinkTwiceThenType() {
        let count = 0;

        const interval = setInterval(() => {
            if (!cursor) return;

            cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
            count++;

            if (count >= 4) {
                clearInterval(interval);
                if (cursor) cursor.style.opacity = "1";
                type();
            }
        }, 200);
    }

    // --- typing ---
    function type() {
        if (i < fullText.length) {
            typewriterText.textContent += fullText[i];
            i++;
            setTimeout(type, 45);
        } else {
            finish();
        }
    }

    // --- finish (SAFE VERSION) ---
    function finish() {
        typewriter.classList.add("done");

        if (!cursor) return;

        let count = 0;

        const interval = setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
            count++;

            if (count >= 4) { // 2 full blinks
                clearInterval(interval);

                // final state: hidden
                cursor.style.opacity = "0";
                cursor.style.visibility = "hidden";
                cursor.style.animation = "none";
            }
        }, 200);
    }

    blinkTwiceThenType();
}
function setActiveHobby(activeButton) {
    hobbyButtons.forEach(btn => {
        btn.classList.toggle('is-active', btn === activeButton);
    });
}

let aboutSwapTimeout = null;
const defaultAboutText = aboutCopy ? aboutCopy.textContent : "";

let typingTimeout = null;

function typeText(element, text, speed = 18) {
    element.innerHTML = "";
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    element.appendChild(cursor);
    let i = 0;

    function type() {
        if (i < text.length) {
            cursor.insertAdjacentText("beforebegin", text.charAt(i));
            i++;
            typingTimeout = setTimeout(type, speed);
        } else {
            // remove cursor at end
            element.classList.remove("typing");
        }
    }

    type();
}

function swapAboutText(text, hobbyKey = "default") {
    if (!aboutCopy) return;

    clearTimeout(typingTimeout);

    // update title FIRST (no animation conflicts)
    if (aboutTitle) {
        aboutTitle.textContent = hobbyTitle[hobbyKey] || hobbyTitle.default;
    }

    // fade out
    aboutCopy.classList.add('is-fading');

    setTimeout(() => {
        aboutCopy.classList.remove('is-fading');
        typeText(aboutCopy, text);
    }, 150);
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
            swapAboutText(hobbyCopy[key], key);
        });
    });

    if (aboutResetTarget) {
        aboutResetTarget.addEventListener('click', resetAbout);
    }
}

initThemeToggle();
initTypewriter();
initAboutInteractions();