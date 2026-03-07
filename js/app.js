/**
 * LearnMint - Core Application Logic
 * Simplified and consolidated for beginners.
 */

// --- 1. SHARED HELPERS & NAVBAR ---

// update navbar based on user login
function updateNavbar() {
    const navLinks = document.getElementById("nav-links");
    const navAuth = document.getElementById("nav-auth");
    if (!navLinks) return;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const path = window.location.pathname;
    const isHome = path.includes("index.html") || path.endsWith("/");
    const isCourses = path.includes("courses.html") || path.includes("course.html");
    const isPricing = path.includes("pricing.html");

    // Always render nav links in center
    navLinks.innerHTML = `
        <a href="index.html" class="${isHome ? 'active' : ''}">Home</a>
        <a href="courses.html" class="${isCourses ? 'active' : ''}">Courses</a>
        <a href="pricing.html" class="${isPricing ? 'active' : ''}">Pricing</a>
    `;

    if (!navAuth) return;

    if (currentUser) {
        // Logged In State — render profile icon in nav-auth
        const initial = currentUser.name.charAt(0).toUpperCase();
        navAuth.innerHTML = `
            <div class="profile-container">
                <div class="profile-trigger" id="profile-trigger">${initial}</div>
                <div class="profile-dropdown" id="profile-dropdown">
                    <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-gray); margin-bottom: 0.5rem;">
                        <p style="font-weight: 700; font-size: 0.9rem; color: var(--primary-dark);">${currentUser.name}</p>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">${currentUser.email}</p>
                    </div>
                    <a href="dashboard.html" class="${path.includes('dashboard.html') ? 'active' : ''}">My Dashboard</a>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
        `;

        // Profile Dropdown Toggle
        const trigger = document.getElementById("profile-trigger");
        const dropdown = document.getElementById("profile-dropdown");
        if (trigger) {
            trigger.onclick = () => dropdown.classList.toggle("active");
            document.addEventListener("click", (e) => {
                if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove("active");
                }
            });
        }
    } else {
        // Logged Out State — render login/signup in nav-auth
        navAuth.innerHTML = `
            <a href="login.html" class="btn btn-outline" style="padding: 0.5rem 1rem;">Login</a>
            <a href="signup.html" class="btn btn-primary" style="padding: 0.5rem 1rem;">Sign Up</a>
        `;
    }
}

// logout user and redirect
window.logout = function () {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
};

// show simple notification
function showNotification(message, type = "success") {
    alert(message); // Simplified to alert for beginners, can be replaced with Toast later
}

// Mobile Menu
// toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
if (menuToggle) {
    menuToggle.onclick = () => navLinks.classList.toggle("active");
}

// --- 2. AUTHENTICATION ---

// handle signup form
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (!name || !email || !password) {
        showNotification("Please fill all fields", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email exists
    for (let u of users) {
        if (u.email === email) {
            showNotification("Email already registered!", "error");
            return;
        }
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        enrolledCourses: [],
        completedLessons: [], // Shared across courses: "courseId_lessonId"
        completedCourses: [],
        plan: localStorage.getItem("pendingPlan") || "No Plan"
    };

    localStorage.removeItem("pendingPlan");

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    showNotification("Account created! Please login.");
    window.location.href = "login.html";
}

// handle login form
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userFound = null;

    for (let u of users) {
        if (u.email === email && u.password === password) {
            userFound = u;
            break;
        }
    }

    if (userFound) {
        localStorage.setItem("currentUser", JSON.stringify(userFound));
        window.location.href = "dashboard.html";
    } else {
        showNotification("Invalid credentials", "error");
    }
}

// --- 3. COURSE MARKETPLACE ---

// render course cards
function renderCourses(courseArray) {
    const grid = document.getElementById("course-grid");
    if (!grid) return;

    grid.innerHTML = "";
    courseArray.forEach(course => {
        const card = document.createElement("article");
        card.className = "course-card";
        card.innerHTML = `
            <div class="card-image-container" style="overflow: hidden; height: 200px;">
                <img src="${course.image}" alt="${course.title}" class="card-image">
            </div>
            <div class="card-body" style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <span class="card-tag">${course.tag}</span>
                    <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">⭐ ${course.rating}</span>
                </div>
                <h3 class="card-title" style="font-size: 1.25rem; margin-bottom: 1rem; flex: 1;">${course.title}</h3>
                <div class="card-meta" style="margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-gray);">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="opacity: 0.7;">⏱</span>
                        <span>${course.duration}</span>
                    </div>
                    <div style="font-weight: 700; color: var(--primary-dark); font-size: 1.1rem;">
                        ₹${course.price}
                    </div>
                </div>
                <button onclick="viewCourse(${course.id})" class="btn btn-primary" style="width: 100%;">View Course</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// view selected course
window.viewCourse = function (id) {
    localStorage.setItem("selectedCourseId", id);
    window.location.href = "course.html";
};

// --- 4. COURSE VIEWER ---

// current course data
let currentCourse = null;
// active lesson data
let activeLesson = null;

// load course viewer page
function loadCourseViewer() {
    const courseId = localStorage.getItem("selectedCourseId");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    currentCourse = window.courses.find(c => c.id == courseId);
    if (!currentCourse) return;

    // Render Basic Details
    document.getElementById("course-title").innerText = currentCourse.title;
    document.getElementById("sidebar-course-title").innerText = currentCourse.title;
    document.getElementById("course-instructor").innerText = currentCourse.lessons && currentCourse.lessons.length > 0 ? currentCourse.lessons[0].instructor : "LearnMint Instructor";

    // Feature 5: Instructor Rating Display using star icons
    let stars = "";
    const rating = Math.round(currentCourse.rating); // 4.8 -> 5
    for (let i = 0; i < Math.floor(rating); i++) stars += "⭐";

    document.getElementById("course-rating").innerHTML = `${stars} (${currentCourse.rating})`;

    document.getElementById("course-duration").innerText = currentCourse.duration;
    document.getElementById("course-description").innerText = currentCourse.description || "Master the essentials of " + currentCourse.title + " with this intensive micro-course.";

    // Check Enrollment
    const isEnrolled = user && user.enrolledCourses.includes(currentCourse.id);
    const overlay = document.getElementById("enroll-overlay");
    const player = document.getElementById("video-player-frame");

    if (!isEnrolled) {
        overlay.style.display = "flex";
        player.style.display = "none";
        document.getElementById("enroll-price").innerText = `₹${currentCourse.price}`;
    } else {
        overlay.style.display = "none";
        player.style.display = "block";
        renderLessonSidebar();
        updateProgress();
    }
}

// enroll in course
window.enrollNow = function () {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const planLimits = { "No Plan": 0, "Basic": 1, "Bundle": 3, "Pro": Infinity };
    const userPlan = user.plan || "No Plan";

    // Check if limit is reached
    if (user.enrolledCourses.length >= planLimits[userPlan]) {
        // Individual purchase bypass
        if (confirm(`Your ${userPlan} plan allows a maximum of ${planLimits[userPlan]} course${planLimits[userPlan] > 1 ? 's' : ''}.\n\nWould you like to purchase this course individually for ₹${currentCourse.price}?`)) {
            showNotification(`Successfully purchased ${currentCourse.title} for ₹${currentCourse.price}!`);
            user.enrolledCourses.push(currentCourse.id);
            saveUserData(user);
            loadCourseViewer();
        }
        return;
    }

    // Normal plan enrollment
    user.enrolledCourses.push(currentCourse.id);
    saveUserData(user);
    showNotification(`Successfully enrolled in ${currentCourse.title} using your ${userPlan} plan.`);
    loadCourseViewer();
};

// render lesson sidebar
function renderLessonSidebar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const list = document.getElementById("lesson-list");
    list.innerHTML = "";

    currentCourse.lessons.forEach((lesson, index) => {
        const isCompleted = user.completedLessons.includes(`${currentCourse.id}_${lesson.id}`);
        // Lesson 1 (index 0) is always unlocked.
        // Lesson N unlocks only if Lesson N-1 is completed.
        const isLocked = index > 0 && !user.completedLessons.includes(`${currentCourse.id}_${currentCourse.lessons[index - 1].id}`);

        const item = document.createElement("div");
        item.className = `lesson-item ${isLocked ? 'locked' : ''} ${activeLesson?.id === lesson.id ? 'active' : ''}`;

        let iconHtml = '';
        if (isLocked) {
            iconHtml = '<span class="lock-icon">🔒</span>';
        } else if (isCompleted) {
            iconHtml = '<span style="color: var(--primary-mint);">✅</span>';
        } else {
            iconHtml = '<span>🎬</span>';
        }

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                ${iconHtml}
                <span>${index + 1}. ${lesson.title}</span>
            </div>
        `;

        if (!isLocked) {
            item.onclick = () => switchLesson(lesson);
        } else {
            // Disabled style directly applied via JS if css class isn't enough, but CSS will handle it.
            item.onclick = (e) => {
                e.preventDefault();
                showNotification("Please complete previous lessons to unlock.", "error");
            };
        }
        list.appendChild(item);
    });

    // Auto-select first lesson or active lesson if unset and unlocked
    if (!activeLesson) {
        switchLesson(currentCourse.lessons[0]);
    } else {
        const activeIndex = currentCourse.lessons.findIndex(l => l.id === activeLesson.id);
        if (activeIndex > 0) {
            const prevLessonId = currentCourse.lessons[activeIndex - 1].id;
            const prevLessonCompleted = user.completedLessons.includes(`${currentCourse.id}_${prevLessonId}`);
            if (!prevLessonCompleted) {
                switchLesson(currentCourse.lessons[0]);
            }
        }
    }
}

// switch to selected lesson
function switchLesson(lesson) {
    activeLesson = lesson;
    document.getElementById("active-lesson-title").innerText = lesson.title;
    document.getElementById("video-player-frame").src = lesson.video;

    // Update instructor dynamically based on active lesson
    const instructorName = lesson.instructor || "LearnMint Instructor";

    // Top bar update
    const topInstructorEl = document.getElementById("course-instructor");
    if (topInstructorEl) {
        topInstructorEl.innerText = instructorName;
    }

    // Bottom Profile Card Update
    const cardNameEl = document.getElementById("instructor-card-name");
    const cardAvatarEl = document.getElementById("instructor-card-avatar");
    const cardStatsEl = document.getElementById("instructor-card-stats");
    const cardBioEl = document.getElementById("instructor-card-bio");

    if (cardNameEl && cardAvatarEl && cardBioEl && cardStatsEl) {
        cardNameEl.innerText = instructorName;

        // Generate initials
        const nameParts = instructorName.split(' ');
        let initials = "LM";
        if (nameParts.length >= 2) {
            initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            initials = nameParts[0].substring(0, 2).toUpperCase();
        }
        cardAvatarEl.innerText = initials;

        // Change color based on name length to give a dynamic feel
        const colors = ['purple', 'pink', 'blue', 'orange', 'teal'];
        const colorClass = `avatar-gradient-${colors[instructorName.length % colors.length]}`;
        cardAvatarEl.className = `instructor-profile-image ${colorClass}`;

        // Generate generic stats
        const rating = (4.5 + (instructorName.length % 5) * 0.1).toFixed(1);
        const coursesCount = 3 + (instructorName.length % 7);
        cardStatsEl.innerHTML = `
            <span class="instructor-stat">⭐ ${rating} Rating</span>
            <span class="instructor-stat">📚 ${coursesCount} Courses Taught</span>
        `;

        // Generate a dynamic bio
        cardBioEl.innerText = `${instructorName} is an expert educator and industry professional. Passionate about teaching modern skills and helping students bridge the gap between theory and practice through hands-on project building.`;
    }

    renderLessonSidebar();
    updateMarkButton();
}

// update mark button state
function updateMarkButton() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const btn = document.getElementById("mark-completed-btn");
    const certBtn = document.getElementById("certificate-btn");

    if (!activeLesson || !user) return;
    const lessonKey = `${currentCourse.id}_${activeLesson.id}`;

    // Verify Certificate Download Lock
    if (certBtn && currentCourse && currentCourse.lessons) {
        const allCompleted = currentCourse.lessons.every(l => user.completedLessons.includes(`${currentCourse.id}_${l.id}`));
        if (!allCompleted) {
            certBtn.disabled = true;
            certBtn.style.opacity = "0.5";
            certBtn.style.cursor = "not-allowed";
            certBtn.title = "Complete all lessons to unlock";
        } else {
            certBtn.disabled = false;
            certBtn.style.opacity = "1";
            certBtn.style.cursor = "pointer";
            certBtn.title = "Download your certificate";
        }
    }

    if (!btn) return;

    if (user.completedLessons.includes(lessonKey)) {
        btn.innerText = "Completed ✓";
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "default";
        btn.style.background = "#dcfce7";
        btn.style.color = "#166534";
        btn.style.border = "1px solid #bbf7d0";
    } else {
        btn.innerText = "Mark as Completed";
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.style.background = "";
        btn.style.color = "";
        btn.style.border = "";
    }
}

// mark lesson as completed
window.markAsCompleted = function () {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const lessonKey = `${currentCourse.id}_${activeLesson.id}`;

    if (!user.completedLessons.includes(lessonKey)) {
        user.completedLessons.push(lessonKey);

        // Check if entire course is done
        const allDone = currentCourse.lessons.every(l => user.completedLessons.includes(`${currentCourse.id}_${l.id}`));

        saveUserData(user); // Save first to ensure progress state is 100%

        renderLessonSidebar();
        updateProgress();
        updateMarkButton();

        if (allDone && !user.completedCourses.includes(currentCourse.id)) {
            user.completedCourses.push(currentCourse.id);
            saveUserData(user); // Save again with completed courses

            // Requirement 3: Show course completion alert popup
            alert("Congratulations! You completed this course.");

            // Display Certificate Viewer exactly after completion
            window.showCertificateViewer(currentCourse.id);
        }

        // Auto move to next lesson
        const currentIndex = currentCourse.lessons.findIndex(l => l.id === activeLesson.id);
        if (currentIndex < currentCourse.lessons.length - 1) {
            switchLesson(currentCourse.lessons[currentIndex + 1]);
        }
    }
};

// update course progress
function updateProgress() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const completedInThisCourse = currentCourse.lessons.filter(l => user.completedLessons.includes(`${currentCourse.id}_${l.id}`)).length;
    const percentage = Math.round((completedInThisCourse / currentCourse.lessons.length) * 100);

    document.getElementById("course-progress-bar").style.width = percentage + "%";
    document.getElementById("progress-percentage").innerText = percentage + "%";

    if (percentage === 100) {
        document.getElementById("certificate-btn").style.display = "block";
    }
}

// --- 5. DASHBOARD ---

// render user dashboard
function renderDashboard() {
    // default view
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        if (sec.id !== 'section-overview') sec.style.display = 'none';
        else sec.style.display = 'block';
    });

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    document.getElementById("user-name").innerText = user.name;
    const container = document.getElementById("enrolled-courses-container");
    container.innerHTML = "";

    if (user.enrolledCourses.length === 0) {
        container.innerHTML = `<p>No courses enrolled. <a href="courses.html">Browse now</a></p>`;
    } else {
        user.enrolledCourses.forEach(id => {
            const course = window.courses.find(c => c.id == id);
            if (!course) return;

            const completedCount = course.lessons.filter(l => user.completedLessons.includes(`${course.id}_${l.id}`)).length;
            const percentage = Math.round((completedCount / course.lessons.length) * 100);
            const isCompleted = user.completedCourses.includes(course.id);

            let statusHtml = '';
            if (isCompleted) {
                statusHtml = '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Completed</span>';
            } else if (percentage > 0) {
                statusHtml = '<span style="background: #fef9c3; color: #854d0e; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">In Progress</span>';
            } else {
                statusHtml = '<span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Not Started</span>';
            }

            const card = document.createElement("article");
            card.className = "course-card";
            card.style.padding = "1.5rem";
            card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 style="margin-top: 0;">${course.title}</h3>
                ${statusHtml}
            </div>
            <div style="display: flex; justify-content: space-between; margin: 1rem 0;">
                <span>Progress</span>
                <span style="font-weight: 700;">${percentage}%</span>
            </div>
            <div class="progress-container"><div class="progress-bar" style="width: ${percentage}%"></div></div>
            <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
                <button onclick="viewCourse(${course.id})" class="btn btn-primary" style="flex: 1;">${isCompleted ? 'Review' : 'Continue'}</button>
                ${isCompleted ? `<button onclick="showCertificateViewer(${course.id})" class="btn btn-outline" title="View Certificate">🏆</button>` : ''}
            </div>
        `;
            container.appendChild(card);
        });
    }

    const recContainer = document.getElementById("recommended-courses-container");
    if (recContainer) {
        recContainer.innerHTML = "";
        const availableRecs = window.courses.filter(c => !user.enrolledCourses.includes(c.id));
        const recsToShow = availableRecs.slice(0, 3);

        if (recsToShow.length === 0) {
            recContainer.innerHTML = `<p style="color: var(--text-muted);">You've enrolled in all available courses!</p>`;
        } else {
            recsToShow.forEach(course => {
                const card = document.createElement("article");
                card.className = "course-card";
                card.innerHTML = `
                    <div class="card-image-container" style="overflow: hidden; height: 160px; border-radius: 12px 12px 0 0;">
                        <img src="${course.image}" alt="${course.title}" class="card-image" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-body" style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                        <span class="card-tag" style="margin-bottom: 0.5rem; display: inline-block;">${course.tag}</span>
                        <h3 class="card-title" style="font-size: 1.15rem; margin-bottom: 0.5rem; color: var(--primary-dark);">${course.title}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5;">${course.description.substring(0, 80)}...</p>
                        <button onclick="viewCourse(${course.id})" class="btn btn-outline" style="width: 100%; margin-top: auto;">Explore Course</button>
                    </div>
                `;
                recContainer.appendChild(card);
            });
        }
    }
}

// switch dashboard sections
window.switchDashboardSection = function (sectionId, element) {
    document.querySelectorAll('.sidebar-nav-list a').forEach(a => a.classList.remove('sidebar-active-link', 'active'));
    if (element) element.classList.add('sidebar-active-link');

    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });

    const targetSection = document.getElementById('section-' + sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => targetSection.classList.add('active'), 10);
    }

    if (sectionId === 'certificates') renderDashboardCertificates();
    else if (sectionId === 'plans') renderDashboardPlans();
};

function renderDashboardCertificates() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const container = document.getElementById("certificates-container");
    if (!container) return;
    container.innerHTML = "";

    if (!user || user.completedCourses.length === 0) {
        container.innerHTML = `<p>No certificates earned yet. Complete a course to earn one!</p>`;
        return;
    }

    container.className = "certificates-grid"; // Added class for responsive grid

    user.completedCourses.forEach(id => {
        const course = window.courses.find(c => c.id == id);
        if (!course) return;
        const card = document.createElement("article");
        card.className = "certificate-card"; // new specific class
        card.style.padding = "2rem 1.5rem";
        card.style.border = "1px solid #e2e8f0";
        card.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)";
        card.style.background = "#ffffff";
        card.style.borderRadius = "14px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.textAlign = "center";
        card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

        // Add hover effect directly to the card
        card.onmouseover = () => {
            card.style.transform = "translateY(-4px)";
            card.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)";
        };
        card.onmouseout = () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)";
        };

        card.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏆</div>
            <h3 style="margin: 0 0 0.5rem 0; color: #0f172a; font-size: 1.15rem; font-weight: 700; line-height: 1.4;">${course.title}</h3>
            <p style="margin: 0 0 1rem 0; color: #64748b; font-size: 0.85rem; font-weight: 500;">Certificate Earned</p>
            <span style="background: #dcfce7; color: #166534; padding: 4px 16px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; display: inline-block; margin-bottom: 1.5rem; letter-spacing: 0.5px;">✓ CERTIFIED</span>
            <button onclick="showCertificateViewer(${course.id})" style="width: 100%; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; padding: 0.75rem; cursor: pointer; transition: background 0.2s ease;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='#0f172a'">
                View Certificate
            </button>
        `;
        container.appendChild(card);
    });
}

function renderDashboardPlans() {
    const container = document.getElementById("plans-container");
    if (!container) return;

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userPlan = user ? (user.plan || "No Plan") : "No Plan";

    let planDesc = "You are not subscribed to any plan.";
    let planLimits = "Please upgrade to enroll in courses.";
    if (userPlan === "Basic") {
        planDesc = "Perfect for a quick skill boost.";
        planLimits = "Strictly limited to 1 course enrollment.";
    } else if (userPlan === "Bundle") {
        planDesc = "The most popular choice.";
        planLimits = "Access up to 3 micro-courses.";
    } else if (userPlan === "Pro") {
        planDesc = "You have full access to all micro-courses, premium certificates, and priority support.";
        planLimits = "Unlimited enrollments.";
    }

    container.innerHTML = `
        <div class="course-card" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="margin-top: 0; font-size: 1.5rem; color: var(--primary-dark);">${userPlan === "No Plan" ? "No Plan" : userPlan + " Plan"}</h3>
                    <p style="color: var(--text-muted); margin-bottom: 0.5rem;">${userPlan === "No Plan" ? "Inactive Subscription" : "Active Subscription"}</p>
                    <p style="color: var(--primary-mint); font-weight: 500; font-size: 0.9rem;">${planLimits}</p>
                </div>
                ${userPlan === "No Plan"
            ? '<span class="badge" style="background: #f1f5f9; color: var(--text-muted);">Inactive</span>'
            : '<span class="badge" style="background: var(--light-mint); color: var(--primary-dark);">Active</span>'
        }
            </div>
            <p style="color: var(--text-color); margin-top: 1rem;">${planDesc}</p>
            ${userPlan === "No Plan" ? '' : `
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-gray);">
                <p style="color: var(--text-color);"><strong>Next billing date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            `}
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                ${userPlan === "No Plan"
            ? `<button class="btn btn-primary" onclick="window.location.href='pricing.html'">View Plans</button>`
            : `<button class="btn btn-outline" onclick="window.location.href='pricing.html'">Change Plan</button>
                       <button class="btn btn-primary" onclick="alert('Manage billing logically goes here.')">Manage Billing</button>`
        }
            </div>
        </div>
    `;
}

// --- CERTIFICATE LOGIC ---

// show certificate modal
window.showCertificateViewer = function (id) {
    const courseId = id || localStorage.getItem("selectedCourseId");
    const course = window.courses.find(c => c.id == courseId);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    document.getElementById("cert-course-title").innerText = course.title;
    document.getElementById("cert-user-name").innerText = user.name;

    // Use the actual date formatting and ensure label
    const dateElement = document.getElementById("cert-date");
    if (dateElement) dateElement.innerText = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById("certificate-modal").style.display = "flex";
};

// close modal
window.closeModal = () => document.getElementById("certificate-modal").style.display = "none";

// --- GLOBAL INIT ---

// save user data to storage
function saveUserData(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

// init app on page load
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    animateStats(); // Start stats animation
    initFadeIn();   // Start fade-in animations

    // Route-specific logic
    const path = window.location.pathname;

    if (path.includes("index.html") || path === "/") {
        renderCourses(window.courses.slice(0, 6));
    } else if (path.includes("courses.html")) {
        renderCourses(window.courses);
        // Simple search
        const search = document.getElementById("search-input");
        if (search) {
            search.oninput = (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = window.courses.filter(c => {
                    const inst = c.lessons && c.lessons.length > 0 ? c.lessons[0].instructor.toLowerCase() : "";
                    return c.title.toLowerCase().includes(query) || inst.includes(query);
                });
                renderCourses(filtered);
            };
        }
    } else if (path.includes("course.html")) {
        loadCourseViewer();
    } else if (path.includes("dashboard.html")) {
        renderDashboard();
    } else if (path.includes("login.html")) {
        document.getElementById("login-form").onsubmit = handleLogin;
    } else if (path.includes("signup.html")) {
        document.getElementById("signup-form").onsubmit = handleSignup;
    }
});

// --- 6. STATS ANIMATION ---

// animate stat numbers when section comes into view
function animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.getAttribute("data-target"));
                const isDecimal = element.getAttribute("data-decimal") === "true";
                let current = 0;
                const increment = target / 40; // Animation duration steps

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
                }, 25);

                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

// reveal elements on scroll
function initFadeIn() {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// Global Plan Logic for Pricing
// handle pricing plan selection
window.handlePlanSelection = function (plan) {
    if (localStorage.getItem("currentUser")) {
        let user = JSON.parse(localStorage.getItem("currentUser"));
        user.plan = plan;
        saveUserData(user);
        showNotification(`Successfully subscribed to ${plan} plan!`);
        window.location.href = "dashboard.html";
    } else {
        localStorage.setItem("pendingPlan", plan);
        window.location.href = "signup.html";
    }
};

// end of logic
