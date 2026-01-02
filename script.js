const SECTIONS = [
    {
        id: 'admin',
        title: "Admin Portal",
        subtitle: "Comprehensive control and oversight for your institution. Manage your entire educational ecosystem with powerful analytics and intuitive controls.",
        views: [
            { title: "Dashboard", description: "Real-time institutional health metrics and enrollment trends." },
            { title: "User Control", description: "Batch management of student and faculty credentials." },
            { title: "Resource Planning", description: "Automated scheduling and facility allocation tools." }
        ]
    },
    {
        id: 'wellness',
        title: "Wellness Hub",
        subtitle: "Prioritizing the mental and emotional well-being of your educational community with integrated support and AI wellness features.",
        views: [
            { title: "Wellness Bot", description: "Instant access to emotional support and mindfulness resources.", icon: "💖" },
            { title: "Mood Tracker", description: "Visualized emotional trends for proactive care." },
            { title: "Crisis Support", description: "One-tap connection to professional intervention services." }
        ]
    },
    {
        id: 'teacher',
        title: "Teacher Portal",
        subtitle: "Empower educators with tools designed to enhance teaching effectiveness and reduce administrative burden.",
        views: [
            { title: "Class Manager", description: "Seamlessly organize assignments and track student growth." },
            { title: "GradeBook AI", description: "Automated scoring with detailed qualitative feedback." },
            { title: "Content Hub", description: "Centralized repository for multimedia lesson plans." }
        ]
    },
    {
        id: 'student',
        title: "Student Portal",
        subtitle: "An intuitive learning environment that keeps students engaged, organized, and motivated to succeed.",
        views: [
            { title: "My Learning", description: "Interactive course materials and personalized deadline tracking." },
            { title: "Peer Study", description: "Collaborative project spaces and virtual study rooms." },
            { title: "Achievement Map", description: "Gamified progress tracking and certification paths." }
        ]
    },
    {
        id: 'ai',
        title: "AI Insights",
        subtitle: "Revolutionize your institution with cutting-edge artificial intelligence that enhances learning and streamlines tasks.",
        views: [
            { title: "Smart Tutor", description: "24/7 AI assistance for students with subject mastery.", icon: "🧠" },
            { title: "Predictive Ops", description: "AI-driven forecasting for student outcomes and dropout prevention." },
            { title: "GenAI Content", description: "Automatic generation of quizzes and supplemental materials." }
        ]
    }
];

let activeSection = 'hero';
let subIndex = 0;
let currentSectionData = SECTIONS[0];

// Initialize title with interactive characters
const titleText = "ORBIT LMS";
const titleEl = document.getElementById('title-text');
titleText.split("").forEach(char => {
    const span = document.createElement('span');
    span.className = char === " " ? "title-space" : "title-char";
    span.textContent = char;
    titleEl.appendChild(span);
});

// Custom cursor
const symbols = ['X', '+', '-', '%', '!'];
const BUFFER_SIZE = 40;
const coords = new Array(BUFFER_SIZE).fill({ x: 0, y: 0 });
const cursorGlow = document.querySelector('.cursor-glow');
const cursorTrail = document.getElementById('cursor-trail');

symbols.forEach((symbol, i) => {
    const el = document.createElement('div');
    el.className = 'cursor-trail-symbol';
    el.textContent = symbol;
    el.dataset.index = i;
    cursorTrail.appendChild(el);
});

window.addEventListener('mousemove', (e) => {
    coords.unshift({ x: e.clientX, y: e.clientY });
    coords.pop();

    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
    cursorGlow.style.visibility = 'visible';

    const isHero = activeSection === 'hero';
    document.querySelectorAll('.cursor-trail-symbol').forEach((el, i) => {
        const step = 7;
        const index = Math.min((i + 1) * step, BUFFER_SIZE - 1);
        const pos = coords[index];
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.style.opacity = isHero ? 1 - (i / symbols.length) : 0;
        el.style.visibility = pos.x === 0 ? 'hidden' : 'visible';
    });
});

// Navigation
function scrollInto(id) {
    if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

document.querySelectorAll('.nav-pill button').forEach(btn => {
    btn.addEventListener('click', () => {
        scrollInto(btn.dataset.section);
    });
});

// Render sections
const contentLayers = document.getElementById('content-layers');
SECTIONS.forEach(section => {
    const sectionEl = document.createElement('section');
    sectionEl.id = section.id;
    sectionEl.className = 'scroll-section';
    sectionEl.innerHTML = `
        <div class="text-content">
            <h2 class="section-title">${section.title}</h2>
            <p class="section-subtitle">${section.subtitle}</p>
        </div>
    `;
    contentLayers.appendChild(sectionEl);
});

// Render phone slides
function renderPhoneSlides() {
    const subSlides = document.getElementById('sub-slides');
    const screenDots = document.getElementById('screen-dots');
    const appBar = document.getElementById('app-bar');

    subSlides.innerHTML = '';
    screenDots.innerHTML = '';

    appBar.textContent = `Orbit ${currentSectionData.id.toUpperCase()}`;

    currentSectionData.views.forEach((view, i) => {
        const slide = document.createElement('div');
        slide.className = 'sub-slide';
        slide.innerHTML = `
            ${view.icon ? `<div class="phone-icon-large">${view.icon}</div>` : ''}
            <h2>${view.title}</h2>
            <p>${view.description}</p>
        `;
        subSlides.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `s-dot ${i === subIndex ? 'active' : ''}`;
        screenDots.appendChild(dot);
    });

    subSlides.style.transform = `translateX(-${subIndex * 100}%)`;
}

function nextSub() {
    subIndex = (subIndex < currentSectionData.views.length - 1) ? subIndex + 1 : 0;
    renderPhoneSlides();
}

function prevSub() {
    subIndex = (subIndex > 0) ? subIndex - 1 : currentSectionData.views.length - 1;
    renderPhoneSlides();
}

document.getElementById('next-btn').addEventListener('click', nextSub);
document.getElementById('prev-btn').addEventListener('click', prevSub);

// Scroll handling
function handleScroll() {
    const app = document.getElementById('app');
    const nav = document.querySelector('.floating-nav');
    
    if (window.pageYOffset < window.innerHeight / 3) {
        activeSection = 'hero';
        app.className = 'app-container bg-transition-purple is-hero-active';
        nav.className = 'floating-nav is-hero';
    } else {
        let currentSection = 'hero';
        SECTIONS.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = section.id;
                }
            }
        });

        if (currentSection !== activeSection) {
            activeSection = currentSection;
            subIndex = 0;
            currentSectionData = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];
            renderPhoneSlides();
        }

        if (currentSection === 'wellness') {
            app.className = 'app-container bg-transition-wellness is-content-active';
        } else {
            app.className = 'app-container bg-transition-purple is-content-active';
        }

        nav.className = 'floating-nav is-sidebar';
    }

    document.querySelectorAll('.nav-pill button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === activeSection);
    });
}

window.addEventListener('scroll', handleScroll, { passive: true });
renderPhoneSlides();
