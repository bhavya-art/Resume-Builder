// Live Preview Update
function updatePreview() {
    document.getElementById("previewName").innerText = document.getElementById("fullName").value || "Your Name";
    document.getElementById("previewEmail").innerText = document.getElementById("email").value || "your.email@example.com";
    document.getElementById("previewPhone").innerText = document.getElementById("phone").value || "+91 123-456-7890";
    document.getElementById("previewSummary").innerText = document.getElementById("summary").value;

    const summary = document.getElementById("summary").value;
    document.getElementById("summarySection").style.display = summary ? "block" : "none";
}

// Add Experience
function addExperience() {
    const container = document.getElementById("experiencecontainer");
    const index = container.children.length;

    const html = `
        <div class="form-group">
            <input type="text" placeholder="Job Title" oninput="renderExperiences()" data-index="${index}" data-field="title">
            <input type="text" placeholder="Company Name" oninput="renderExperiences()" data-index="${index}" data-field="company">
            <textarea placeholder="Job Description" oninput="renderExperiences()" data-index="${index}" data-field="description"></textarea>
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
}

// Render Experience
function renderExperiences() {
    const container = document.getElementById("experiencecontainer");
    const preview = document.getElementById("previewExperience");
    preview.innerHTML = "";

    const groups = container.querySelectorAll(".form-group");
    let anyContent = false;

    groups.forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        const title = inputs[0].value;
        const company = inputs[1].value;
        const desc = inputs[2].value;

        if (title || company || desc) {
            anyContent = true;
            preview.innerHTML += `
                <div>
                    <strong>${title}</strong> at ${company}
                    <p>${desc}</p>
                </div>
            `;
        }
    });

    document.getElementById("experienceSection").style.display = anyContent ? "block" : "none";
}

// Add Education
function addEducation() {
    const container = document.getElementById("educationcontainer");
    const index = container.children.length;

    const html = `
        <div class="form-group">
            <input type="text" placeholder="Degree" oninput="renderEducation()">
            <input type="text" placeholder="Institution" oninput="renderEducation()">
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
}

// Render Education
function renderEducation() {
    const container = document.getElementById("educationcontainer");
    const preview = document.getElementById("previewEducation");
    preview.innerHTML = "";

    let any = false;

    container.querySelectorAll(".form-group").forEach(group => {
        const degree = group.children[0].value;
        const inst = group.children[1].value;

        if (degree || inst) {
            any = true;
            preview.innerHTML += `<div><strong>${degree}</strong> – ${inst}</div>`;
        }
    });

    document.getElementById("educationSection").style.display = any ? "block" : "none";
}

// Add Projects
function addProjects() {
    const container = document.getElementById("projectscontainer");
    const html = `
        <div class="form-group">
            <input type="text" placeholder="Project Title" oninput="renderProjects()">
            <textarea placeholder="Project Description" oninput="renderProjects()"></textarea>
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
}

function renderProjects() {
    const container = document.getElementById("projectscontainer");
    const preview = document.getElementById("previewProjects");
    preview.innerHTML = "";

    let any = false;
    container.querySelectorAll(".form-group").forEach(group => {
        const title = group.querySelector("input").value;
        const desc = group.querySelector("textarea").value;

        if (title || desc) {
            any = true;
            preview.innerHTML += `<div><strong>${title}</strong><p>${desc}</p></div>`;
        }
    });

    document.getElementById("projectSection").style.display = any ? "block" : "none";
}

// Add Skills
function addSkill(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const input = document.getElementById("skillInput");
        const skill = input.value.trim();
        if (!skill) return;

        const span = document.createElement("span");
        span.textContent = skill;
        document.getElementById("skillsList").appendChild(span);

        const preview = document.createElement("span");
        preview.textContent = skill;
        document.getElementById("previewSkills").appendChild(preview);
        document.getElementById("skillsSection").style.display = "block";

        input.value = "";
    }
}

// Template Application
function applyTemplate(templateName) {
    const preview = document.getElementById("resumePreview");
    preview.classList.remove("template-modern", "template-elegant", "template-creative");
    preview.classList.add(templateName);
}
