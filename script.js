const roleContent = {
    student: {
        kicker: "Student experience",
        title: "Know where to focus this week.",
        description: "Timetable, attendance, grades, fees, subjects and school updates, with a clearer view of what deserves attention next.",
        features: ["Today’s timetable and school calendar", "Attendance and academic progress", "Classroom resources, quizzes and polls"],
        image: "screenshots/student-screen1.png",
        alt: "Orbit student dashboard",
        label: "Student home",
        accent: "#6c3cf0",
        background: "linear-gradient(135deg, #ffffff, #f5f3ff)"
    },
    teacher: {
        kicker: "Teacher experience",
        title: "See who needs you next.",
        description: "Move from schedule to classroom activity, attendance, assessments and class insight with a clearer sense of where support will matter.",
        features: ["Schedule and homeroom at a glance", "Lectures, files, quizzes and polls", "Attendance, grades and class performance"],
        image: "screenshots/teacher-screen2.png",
        alt: "Orbit teacher dashboard",
        label: "Teacher home",
        accent: "#4c9c35",
        background: "linear-gradient(135deg, #ffffff, #effbe9)"
    },
    admin: {
        kicker: "Administrator experience",
        title: "Catch problems before they grow.",
        description: "People, announcements, fees, planning and performance come together in one school view built for earlier intervention.",
        features: ["Manage teachers, students and classes", "Publish announcements and fee structures", "Review class performance and reports"],
        image: "screenshots/admin-screen3.png",
        alt: "Orbit administrator dashboard",
        label: "Administrator home",
        accent: "#276ef1",
        background: "linear-gradient(135deg, #ffffff, #edf4ff)"
    },
    family: {
        kicker: "Family experience",
        title: "Know before it becomes a problem.",
        description: "Linked student profiles make it simple to follow each student’s attendance, fees, progress and updates separately.",
        features: ["Switch safely between student profiles", "Keep each student record distinct", "See fees, attendance and progress clearly"],
        image: "screenshots/student-screen3.png",
        alt: "Orbit family and student progress experience",
        label: "Family view",
        accent: "#dc526c",
        background: "linear-gradient(135deg, #ffffff, #fff0f4)"
    }
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const roleDisplay = document.querySelector("[data-role-display]");
const roleDevice = document.querySelector(".role-device");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const yearTarget = document.querySelector("[data-year]");
if (yearTarget) yearTarget.textContent = new Date().getFullYear();

function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 36);
}

menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
});

menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    });
});

document.querySelectorAll(".role-tab").forEach((tab) => {
    tab.addEventListener("click", () => selectRole(tab.dataset.role));
    tab.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
        event.preventDefault();
        const tabs = [...document.querySelectorAll(".role-tab")];
        const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
        const next = tabs[(tabs.indexOf(tab) + direction + tabs.length) % tabs.length];
        next.focus();
        selectRole(next.dataset.role);
    });
});

function selectRole(role) {
    const content = roleContent[role];
    if (!content) return;

    document.querySelectorAll(".role-tab").forEach((tab) => {
        const active = tab.dataset.role === role;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
    });

    roleDevice.classList.add("is-changing");
    window.setTimeout(() => {
        document.querySelector("[data-role-kicker]").textContent = content.kicker;
        document.querySelector("[data-role-title]").textContent = content.title;
        document.querySelector("[data-role-description]").textContent = content.description;
        document.querySelector("[data-role-label]").textContent = content.label;
        const image = document.querySelector("[data-role-image]");
        image.src = content.image;
        image.alt = content.alt;
        document.querySelector("[data-role-features]").innerHTML = content.features.map((feature) => `<li>${feature}</li>`).join("");
        roleDisplay.style.setProperty("--role-accent", content.accent);
        roleDisplay.style.background = content.background;
        roleDevice.classList.remove("is-changing");
    }, reduceMotion ? 0 : 180);
}

if (window.location.hash) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.13, rootMargin: "0px 0px -40px" });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const orbitStage = document.querySelector("[data-orbit-stage]");
if (orbitStage && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    orbitStage.addEventListener("pointermove", (event) => {
        const bounds = orbitStage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        orbitStage.style.setProperty("--ry", `${x * 5}deg`);
        orbitStage.style.setProperty("--rx", `${y * -4}deg`);
    });
    orbitStage.addEventListener("pointerleave", () => {
        orbitStage.style.setProperty("--ry", "0deg");
        orbitStage.style.setProperty("--rx", "0deg");
    });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
