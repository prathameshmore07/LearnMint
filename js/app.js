// get current logged-in user from storage
const getUser = () => JSON.parse(localStorage.getItem("currentUser"));

// save user to both currentUser and users array
function saveUserData(u) {
    localStorage.setItem("currentUser", JSON.stringify(u));
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const i = users.findIndex(x => x.email === u.email);
    if (i !== -1) { users[i] = u; localStorage.setItem("users", JSON.stringify(users)); }
}

// show alert notification
const showNotification = (msg) => alert(msg);

// logout and go home
window.logout = () => { localStorage.removeItem("currentUser"); window.location.href = "index.html"; };

// --- navbar ---

// build navbar based on login state and current page
function updateNavbar() {
    const navLinks = document.getElementById("nav-links");
    const navAuth = document.getElementById("nav-auth");
    if (!navLinks) return;
    const p = window.location.pathname;
    navLinks.innerHTML = `
        <a href="index.html" class="${p.includes("index") || p.endsWith("/") ? "active" : ""}">Home</a>
        <a href="courses.html" class="${p.includes("course") ? "active" : ""}">Courses</a>
        <a href="pricing.html" class="${p.includes("pricing") ? "active" : ""}">Pricing</a>`;
    if (!navAuth) return;
    const user = getUser();
    if (user) {
        navAuth.innerHTML = `<div class="profile-container"><div class="profile-trigger" id="profile-trigger">${user.name[0].toUpperCase()}</div>
            <div class="profile-dropdown" id="profile-dropdown">
                <div style="padding:.75rem 1rem;border-bottom:1px solid var(--border-gray);margin-bottom:.5rem;">
                    <p style="font-weight:700;font-size:.9rem">${user.name}</p><p style="font-size:.75rem;color:var(--text-muted)">${user.email}</p>
                </div>
                <a href="dashboard.html">My Dashboard</a><button class="logout-btn" onclick="logout()">Logout</button>
            </div></div>`;
        const t = document.getElementById("profile-trigger"), d = document.getElementById("profile-dropdown");
        t.onclick = () => d.classList.toggle("active");
        document.addEventListener("click", e => { if (!t.contains(e.target) && !d.contains(e.target)) d.classList.remove("active"); });
    } else {
        navAuth.innerHTML = `<a href="login.html" class="btn btn-outline" style="padding:.5rem 1rem">Login</a>
            <a href="signup.html" class="btn btn-primary" style="padding:.5rem 1rem">Sign Up</a>`;
    }
}

// toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
if (menuToggle) menuToggle.onclick = () => document.getElementById("nav-links").classList.toggle("active");

// --- auth ---

// register new user
function handleSignup(e) {
    e.preventDefault();
    const [name, email, password] = ["signup-name", "signup-email", "signup-password"].map(id => document.getElementById(id).value);
    if (!name || !email || !password) return showNotification("please fill all fields");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) return showNotification("email already registered!");
    users.push({ name, email, password, enrolledCourses: [], completedLessons: [], completedCourses: [], plan: localStorage.getItem("pendingPlan") || "No Plan" });
    localStorage.removeItem("pendingPlan");
    localStorage.setItem("users", JSON.stringify(users));
    showNotification("account created! please login.");
    window.location.href = "login.html";
}

// log in existing user
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value, password = document.getElementById("login-password").value;
    const user = (JSON.parse(localStorage.getItem("users")) || []).find(u => u.email === email && u.password === password);
    user ? (localStorage.setItem("currentUser", JSON.stringify(user)), window.location.href = "dashboard.html") : showNotification("invalid credentials");
}

// --- courses ---

// build and display course cards in the grid
function renderCourses(arr) {
    const grid = document.getElementById("course-grid");
    if (!grid) return;
    grid.innerHTML = arr.map(c => `
        <article class="course-card">
            <div style="overflow:hidden;height:200px"><img src="${c.image}" alt="${c.title}" class="card-image"></div>
            <div class="card-body" style="padding:1.5rem;display:flex;flex-direction:column;flex:1">
                <div style="display:flex;justify-content:space-between;margin-bottom:.75rem">
                    <span class="card-tag">${c.tag}</span><span style="font-size:.85rem;color:var(--text-muted)">⭐ ${c.rating}</span>
                </div>
                <h3 class="card-title" style="font-size:1.25rem;margin-bottom:1rem;flex:1">${c.title}</h3>
                <div class="card-meta" style="margin-bottom:1.5rem;padding-top:1rem;border-top:1px solid var(--border-gray)">
                    <div>⏱ ${c.duration}</div><div style="font-weight:700;color:var(--primary-dark)">₹${c.price}</div>
                </div>
                <button onclick="viewCourse(${c.id})" class="btn btn-primary" style="width:100%">View Course</button>
            </div>
        </article>`).join("");
}

// go to course detail page
window.viewCourse = id => { localStorage.setItem("selectedCourseId", id); window.location.href = "course.html"; };

// --- course viewer ---
let currentCourse = null, activeLesson = null;

// load the course viewer with all data
function loadCourseViewer() {
    const user = getUser();
    currentCourse = window.courses.find(c => c.id == localStorage.getItem("selectedCourseId"));
    if (!currentCourse) return;
    document.getElementById("course-title").innerText = currentCourse.title;
    document.getElementById("sidebar-course-title").innerText = currentCourse.title;
    document.getElementById("course-rating").innerHTML = "⭐".repeat(Math.floor(currentCourse.rating)) + ` (${currentCourse.rating})`;
    document.getElementById("course-duration").innerText = currentCourse.duration;
    document.getElementById("course-description").innerText = currentCourse.description || "Master " + currentCourse.title;
    const enrolled = user && user.enrolledCourses.includes(currentCourse.id);
    document.getElementById("enroll-overlay").style.display = enrolled ? "none" : "flex";
    document.getElementById("video-player-frame").style.display = enrolled ? "block" : "none";
    if (!enrolled) { document.getElementById("enroll-price").innerText = `₹${currentCourse.price}`; updateMarkButton(); }
    else { renderLessonSidebar(); updateProgress(); }
}

// enroll user in current course
window.enrollNow = function () {
    const user = getUser();
    if (!user) return window.location.href = "login.html";
    const limits = { "No Plan": 0, "Basic": 1, "Bundle": 3, "Pro": Infinity };
    if (user.enrolledCourses.length >= limits[user.plan || "No Plan"]) {
        if (confirm(`plan limit reached.\n\npurchase ${currentCourse.title} individually for ₹${currentCourse.price}?`)) {
            user.enrolledCourses.push(currentCourse.id); saveUserData(user);
            showNotification(`purchased ${currentCourse.title}!`); loadCourseViewer();
        }
        return;
    }
    user.enrolledCourses.push(currentCourse.id); saveUserData(user);
    showNotification(`enrolled in ${currentCourse.title}!`); loadCourseViewer();
};

// draw lesson list in sidebar with lock/complete states
function renderLessonSidebar() {
    const user = getUser();
    document.getElementById("lesson-list").innerHTML = currentCourse.lessons.map((lesson, i) => {
        const done = user.completedLessons.includes(`${currentCourse.id}_${lesson.id}`);
        const locked = i > 0 && !user.completedLessons.includes(`${currentCourse.id}_${currentCourse.lessons[i - 1].id}`);
        return `<div class="lesson-item ${locked ? "locked" : ""} ${activeLesson?.id === lesson.id ? "active" : ""}"
            onclick="${locked ? `event.preventDefault();showNotification('complete previous lessons first')` : `switchLesson(window.courses.find(c=>c.id==${currentCourse.id}).lessons[${i}])`}">
            <div style="display:flex;align-items:center;gap:.75rem">
                <span>${locked ? "🔒" : done ? "✅" : "🎬"}</span><span>${i + 1}. ${lesson.title}</span>
            </div></div>`;
    }).join("");
    if (!activeLesson) switchLesson(currentCourse.lessons[0]);
}

// switch active lesson and update video + instructor card
function switchLesson(lesson) {
    activeLesson = lesson;
    document.getElementById("active-lesson-title").innerText = lesson.title;
    document.getElementById("video-player-frame").src = lesson.video;
    const name = lesson.instructor || "LearnMint Instructor";
    ["course-instructor", "instructor-card-name"].forEach(id => { if (document.getElementById(id)) document.getElementById(id).innerText = name; });
    const av = document.getElementById("instructor-card-avatar");
    if (av) {
        const parts = name.split(" ");
        av.innerText = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
        av.className = `instructor-profile-image avatar-gradient-${["purple", "pink", "blue", "orange", "teal"][name.length % 5]}`;
    }
    const stats = document.getElementById("instructor-card-stats");
    if (stats) stats.innerHTML = `<span class="instructor-stat">⭐ ${(4.5 + (name.length % 5) * 0.1).toFixed(1)} Rating</span><span class="instructor-stat">📚 ${3 + (name.length % 7)} Courses</span>`;
    const bio = document.getElementById("instructor-card-bio");
    if (bio) bio.innerText = `${name} is an expert educator passionate about teaching modern skills and hands-on project building.`;
    renderLessonSidebar(); updateMarkButton();
}

// update the mark complete button appearance
function updateMarkButton() {
    const user = getUser(), btn = document.getElementById("mark-completed-btn"), certBtn = document.getElementById("certificate-btn");
    if (!currentCourse) return;
    const enrolled = user && user.enrolledCourses?.includes(currentCourse.id);
    const key = activeLesson ? `${currentCourse.id}_${activeLesson.id}` : null;
    if (certBtn) {
        const allDone = enrolled && currentCourse.lessons.every(l => user.completedLessons.includes(`${currentCourse.id}_${l.id}`));
        certBtn.innerHTML = "🏆 " + (enrolled ? "Download Certificate" : "Show Certificate Preview");
        certBtn.disabled = enrolled && !allDone;
        Object.assign(certBtn.style, { opacity: enrolled && !allDone ? "0.5" : "1", cursor: enrolled && !allDone ? "not-allowed" : "pointer" });
    }
    if (!btn) return;
    const done = key && user?.completedLessons.includes(key);
    Object.assign(btn.style, { opacity: !enrolled ? "0.5" : done ? "0.7" : "1", cursor: !enrolled || done ? "default" : "pointer", background: !enrolled ? "#f1f5f9" : done ? "#dcfce7" : "", color: !enrolled ? "#94a3b8" : done ? "#166534" : "" });
    btn.innerText = !enrolled ? "🔒 Locked" : done ? "Completed ✓" : "Mark as Completed";
    btn.disabled = !enrolled || done;
}

// mark lesson done and auto-advance or show certificate
window.markAsCompleted = function () {
    const user = getUser(), key = `${currentCourse.id}_${activeLesson.id}`;
    if (!user.enrolledCourses.includes(currentCourse.id)) return showNotification("please enroll first");
    if (user.completedLessons.includes(key)) return;
    user.completedLessons.push(key);
    saveUserData(user); renderLessonSidebar(); updateProgress(); updateMarkButton();
    const allDone = currentCourse.lessons.every(l => user.completedLessons.includes(`${currentCourse.id}_${l.id}`));
    if (allDone && !user.completedCourses.includes(currentCourse.id)) {
        user.completedCourses.push(currentCourse.id); saveUserData(user);
        alert("congratulations! you completed this course."); window.showCertificateViewer(currentCourse.id);
    }
    const idx = currentCourse.lessons.findIndex(l => l.id === activeLesson.id);
    if (idx < currentCourse.lessons.length - 1) switchLesson(currentCourse.lessons[idx + 1]);
};

// update the progress bar percentage
function updateProgress() {
    const user = getUser(), done = currentCourse.lessons.filter(l => user.completedLessons.includes(`${currentCourse.id}_${l.id}`)).length;
    const pct = Math.round((done / currentCourse.lessons.length) * 100);
    document.getElementById("course-progress-bar").style.width = pct + "%";
    document.getElementById("progress-percentage").innerText = pct + "%";
    if (pct === 100) document.getElementById("certificate-btn").style.display = "block";
}

// --- dashboard ---

// render overview, certs, plans based on active section
function renderDashboard() {
    document.querySelectorAll(".dashboard-section").forEach(s => s.style.display = s.id === "section-overview" ? "block" : "none");
    const user = getUser(); if (!user) return;
    document.getElementById("user-name").innerText = user.name;
    const container = document.getElementById("enrolled-courses-container");
    if (!user.enrolledCourses.length) { container.innerHTML = `<p>no courses enrolled. <a href="courses.html">browse now</a></p>`; return; }
    container.innerHTML = user.enrolledCourses.map(id => {
        const c = window.courses.find(x => x.id == id); if (!c) return "";
        const pct = Math.round((c.lessons.filter(l => user.completedLessons.includes(`${c.id}_${l.id}`)).length / c.lessons.length) * 100);
        const done = user.completedCourses.includes(c.id);
        const badge = done ? `<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:12px;font-size:.8rem;font-weight:bold">Completed</span>`
            : pct > 0 ? `<span style="background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:12px;font-size:.8rem;font-weight:bold">In Progress</span>`
                : `<span style="background:#f3f4f6;color:#374151;padding:2px 8px;border-radius:12px;font-size:.8rem;font-weight:bold">Not Started</span>`;
        return `<article class="course-card" style="padding:1.5rem">
            <div style="display:flex;justify-content:space-between;align-items:flex-start"><h3 style="margin-top:0">${c.title}</h3>${badge}</div>
            <div style="display:flex;justify-content:space-between;margin:1rem 0"><span>progress</span><span style="font-weight:700">${pct}%</span></div>
            <div class="progress-container"><div class="progress-bar" style="width:${pct}%"></div></div>
            <div style="margin-top:1.5rem;display:flex;gap:.5rem">
                <button onclick="viewCourse(${c.id})" class="btn btn-primary" style="flex:1">${done ? "Review" : "Continue"}</button>
                ${done ? `<button onclick="showCertificateViewer(${c.id})" class="btn btn-outline">🏆</button>` : ""}
            </div></article>`;
    }).join("");
    const rec = document.getElementById("recommended-courses-container");
    if (rec) {
        const recs = window.courses.filter(c => !user.enrolledCourses.includes(c.id)).slice(0, 3);
        rec.innerHTML = recs.length ? recs.map(c => `<article class="course-card">
            <div style="overflow:hidden;height:160px;border-radius:12px 12px 0 0"><img src="${c.image}" alt="${c.title}" class="card-image" style="width:100%;height:100%;object-fit:cover"></div>
            <div class="card-body" style="padding:1.5rem;display:flex;flex-direction:column;flex:1">
                <span class="card-tag" style="margin-bottom:.5rem">${c.tag}</span>
                <h3 class="card-title" style="font-size:1.15rem;margin-bottom:.5rem">${c.title}</h3>
                <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem">${c.description.substring(0, 80)}...</p>
                <button onclick="viewCourse(${c.id})" class="btn btn-outline" style="width:100%;margin-top:auto">Explore Course</button>
            </div></article>`).join("") : `<p>you've enrolled in all courses!</p>`;
    }
}

// switch between dashboard sections
window.switchDashboardSection = function (id, el) {
    document.querySelectorAll(".sidebar-nav-list a").forEach(a => a.classList.remove("sidebar-active-link", "active"));
    if (el) el.classList.add("sidebar-active-link");
    document.querySelectorAll(".dashboard-section").forEach(s => { s.style.display = "none"; s.classList.remove("active"); });
    const t = document.getElementById("section-" + id);
    if (t) { t.style.display = "block"; setTimeout(() => t.classList.add("active"), 10); }
    if (id === "certificates") renderDashboardCertificates();
    else if (id === "plans") renderDashboardPlans();
};

// render certificate cards for completed courses
function renderDashboardCertificates() {
    const user = getUser(), container = document.getElementById("certificates-container");
    if (!container) return;
    container.className = "certificates-grid";
    container.innerHTML = !user?.completedCourses.length ? `<p>no certificates yet. complete a course!</p>`
        : user.completedCourses.map(id => {
            const c = window.courses.find(x => x.id == id); if (!c) return "";
            return `<article class="certificate-card" style="padding:2rem 1.5rem;border:1px solid #e2e8f0;border-radius:14px;display:flex;flex-direction:column;align-items:center;text-align:center;background:#fff">
                <div style="font-size:2.5rem;margin-bottom:1rem">🏆</div>
                <h3 style="margin:0 0 .5rem;font-size:1.15rem;font-weight:700">${c.title}</h3>
                <p style="margin:0 0 1rem;color:#64748b;font-size:.85rem">certificate earned</p>
                <span style="background:#dcfce7;color:#166534;padding:4px 16px;border-radius:9999px;font-size:.75rem;font-weight:700;margin-bottom:1.5rem">✓ CERTIFIED</span>
                <button onclick="showCertificateViewer(${c.id})" style="width:100%;background:#0f172a;color:white;border:none;border-radius:8px;font-weight:600;padding:.75rem;cursor:pointer">View Certificate</button>
            </article>`;
        }).join("");
}

// show current plan details and upgrade options
function renderDashboardPlans() {
    const container = document.getElementById("plans-container"); if (!container) return;
    const user = getUser(), plan = user?.plan || "No Plan";
    const info = { "Basic": ["1 course enrollment", "perfect for a quick skill boost"], "Bundle": ["up to 3 courses", "the most popular choice"], "Pro": ["unlimited enrollments", "full access + priority support"] };
    const [limit, desc] = info[plan] || ["please upgrade to enroll", "not subscribed to any plan"];
    container.innerHTML = `<div class="course-card" style="padding:2rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div><h3 style="margin-top:0;font-size:1.5rem">${plan === "No Plan" ? "No Plan" : plan + " Plan"}</h3>
            <p style="color:var(--text-muted)">${plan === "No Plan" ? "inactive subscription" : "active subscription"}</p>
            <p style="color:var(--primary-mint);font-weight:500">${limit}</p></div>
            <span class="badge" style="background:${plan === "No Plan" ? "#f1f5f9;color:var(--text-muted)" : "var(--light-mint);color:var(--primary-dark)"}">${plan === "No Plan" ? "Inactive" : "Active"}</span>
        </div>
        <p style="margin-top:1rem">${desc}</p>
        ${plan !== "No Plan" ? `<div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border-gray)"><p><strong>next billing:</strong> ${new Date(Date.now() + 30 * 864e5).toLocaleDateString()}</p></div>` : ""}
        <div style="margin-top:1.5rem;display:flex;gap:1rem">
            ${plan === "No Plan" ? `<button class="btn btn-primary" onclick="window.location.href='pricing.html'">View Plans</button>`
            : `<button class="btn btn-outline" onclick="window.location.href='pricing.html'">Change Plan</button><button class="btn btn-primary" onclick="alert('manage billing goes here')">Manage Billing</button>`}
        </div></div>`;
}

// --- certificate modal ---

// open certificate modal with user and course name
window.showCertificateViewer = function (id) {
    const course = window.courses.find(c => c.id == (id || localStorage.getItem("selectedCourseId")));
    const user = getUser();
    document.getElementById("cert-course-title").innerText = course.title;
    document.getElementById("cert-user-name").innerText = user?.enrolledCourses?.includes(course.id) ? user.name : "Eminem";
    const d = document.getElementById("cert-date");
    if (d) d.innerText = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    document.getElementById("certificate-modal").style.display = "flex";
};

// close certificate modal
window.closeModal = () => document.getElementById("certificate-modal").style.display = "none";

// --- pricing ---

// handle plan selection from pricing page
window.handlePlanSelection = function (plan) {
    if (getUser()) { let u = getUser(); u.plan = plan; saveUserData(u); showNotification(`subscribed to ${plan} plan!`); window.location.href = "dashboard.html"; }
    else { localStorage.setItem("pendingPlan", plan); window.location.href = "signup.html"; }
};

// --- animations ---

// animate stat numbers when scrolled into view
function animateStats() {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = parseFloat(el.getAttribute("data-target")), dec = el.getAttribute("data-decimal") === "true";
        let cur = 0, step = target / 40;
        const t = setInterval(() => { cur = Math.min(cur + step, target); el.innerText = dec ? cur.toFixed(1) : Math.floor(cur); if (cur >= target) clearInterval(t); }, 25);
        obs.unobserve(el);
    }), { threshold: 0.5 });
    document.querySelectorAll(".stat-number").forEach(n => obs.observe(n));
}

// fade in elements when they scroll into view
function initFadeIn() {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }), { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => obs.observe(el));
}

// --- init ---

// run the right logic based on current page
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar(); animateStats(); initFadeIn();
    const p = window.location.pathname;
    if (p.includes("index") || p.endsWith("/")) renderCourses(window.courses.slice(0, 6));
    else if (p.includes("courses")) {
        renderCourses(window.courses);
        const s = document.getElementById("search-input");
        if (s) s.oninput = e => renderCourses(window.courses.filter(c => c.title.toLowerCase().includes(e.target.value.toLowerCase()) || (c.lessons?.[0]?.instructor || "").toLowerCase().includes(e.target.value.toLowerCase())));
    }
    else if (p.includes("course.html")) loadCourseViewer();
    else if (p.includes("dashboard")) renderDashboard();
    else if (p.includes("login")) document.getElementById("login-form").onsubmit = handleLogin;
    else if (p.includes("signup")) document.getElementById("signup-form").onsubmit = handleSignup;
});
