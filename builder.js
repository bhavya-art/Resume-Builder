
// Initialize the builder
document.addEventListener('DOMContentLoaded', function() {
    handleTemplateFromURL();
    loadSavedData();
    updatePreview();
});

// Handle template selection from URL
function handleTemplateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    
    if (template) {
        // Map template names to CSS classes
        const templateMap = {
            'modern': 'template-modern',
            'executive': 'template-professional', 
            'minimal': 'template-minimal'
        };
        
        const templateClass = templateMap[template] || 'template-professional';
        
        // Set the template selector
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.value = templateClass;
            applyTemplate(templateClass);
        }
    }
}

// Live Preview Update
function updatePreview() {
    // Update personal information
    document.getElementById("previewName").innerText = document.getElementById("fullName").value || "Your Name";
    document.getElementById("previewEmail").innerText = document.getElementById("email").value || "your.email@example.com";
    document.getElementById("previewPhone").innerText = document.getElementById("phone").value || "+91 123-456-7890";
    
    // Update LinkedIn
    const linkedin = document.getElementById("linkedin").value;
    const linkedinSpan = document.getElementById("previewLinkedin");
    if (linkedin) {
        linkedinSpan.innerText = linkedin;
        linkedinSpan.style.display = "inline";
    } else {
        linkedinSpan.style.display = "none";
    }
    
    // Update Location
    const location = document.getElementById("location").value;
    const locationSpan = document.getElementById("previewLocation");
    if (location) {
        locationSpan.innerText = location;
        locationSpan.style.display = "inline";
    } else {
        locationSpan.style.display = "none";
    }

    // Update summary
    const summary = document.getElementById("summary").value;
    document.getElementById("previewSummary").innerText = summary;
    document.getElementById("summarySection").style.display = summary ? "block" : "none";
}

// Experience Functions
function addExperience() {
    const container = document.getElementById("experienceContainer");
    const index = container.children.length;

    const html = `
        <div class="form-group" data-type="experience">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                <label style="margin: 0;">Experience ${index + 1}</label>
                <button type="button" class="remove-btn" onclick="removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Job Title" oninput="renderExperiences()" data-field="title">
            <input type="text" placeholder="Company Name" oninput="renderExperiences()" data-field="company">
            <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" oninput="renderExperiences()" data-field="duration">
            <textarea placeholder="Job Description and Key Achievements" oninput="renderExperiences()" data-field="description" rows="3"></textarea>
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
}

function renderExperiences() {
    const container = document.getElementById("experienceContainer");
    const preview = document.getElementById("previewExperience");
    preview.innerHTML = "";

    const groups = container.querySelectorAll(".form-group");
    let anyContent = false;

    groups.forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        const title = inputs[0].value;
        const company = inputs[1].value;
        const duration = inputs[2].value;
        const description = inputs[3].value;

        if (title || company || description) {
            anyContent = true;
            preview.innerHTML += `
                <div class="experience-item">
                    <div class="item-header">
                        <span class="item-title">${title}</span>
                        <span class="item-date">${duration}</span>
                    </div>
                    <div class="item-company">${company}</div>
                    <p>${description}</p>
                </div>
            `;
        }
    });

    document.getElementById("experienceSection").style.display = anyContent ? "block" : "none";
}

// Education Functions
function addEducation() {
    const container = document.getElementById("educationContainer");
    const index = container.children.length;

    const html = `
        <div class="form-group" data-type="education">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                <label style="margin: 0;">Education ${index + 1}</label>
                <button type="button" class="remove-btn" onclick="removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Degree/Qualification" oninput="renderEducation()">
            <input type="text" placeholder="Institution/University" oninput="renderEducation()">
            <input type="text" placeholder="Year/Duration (e.g., 2018-2022)" oninput="renderEducation()">
            <input type="text" placeholder="Grade/GPA (optional)" oninput="renderEducation()">
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
}

function renderEducation() {
    const container = document.getElementById("educationContainer");
    const preview = document.getElementById("previewEducation");
    preview.innerHTML = "";

    let anyContent = false;

    container.querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input");
        const degree = inputs[0].value;
        const institution = inputs[1].value;
        const duration = inputs[2].value;
        const grade = inputs[3].value;

        if (degree || institution) {
            anyContent = true;
            preview.innerHTML += `
                <div class="education-item">
                    <div class="item-header">
                        <span class="item-title">${degree}</span>
                        <span class="item-date">${duration}</span>
                    </div>
                    <div class="item-institution">${institution}</div>
                    ${grade ? `<p>Grade: ${grade}</p>` : ''}
                </div>
            `;
        }
    });

    document.getElementById("educationSection").style.display = anyContent ? "block" : "none";
}

// Projects Functions
function addProjects() {
    const container = document.getElementById("projectsContainer");
    const index = container.children.length;

    const html = `
        <div class="form-group" data-type="project">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                <label style="margin: 0;">Project ${index + 1}</label>
                <button type="button" class="remove-btn" onclick="removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Project Title" oninput="renderProjects()">
            <input type="text" placeholder="Technologies Used" oninput="renderProjects()">
            <textarea placeholder="Project Description and Key Features" oninput="renderProjects()" rows="3"></textarea>
            <input type="url" placeholder="Project Link (optional)" oninput="renderProjects()">
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
}

function renderProjects() {
    const container = document.getElementById("projectsContainer");
    const preview = document.getElementById("previewProjects");
    preview.innerHTML = "";

    let anyContent = false;
    container.querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        const title = inputs[0].value;
        const tech = inputs[1].value;
        const description = inputs[2].value;
        const link = inputs[3].value;

        if (title || description) {
            anyContent = true;
            preview.innerHTML += `
                <div class="project-item">
                    <div class="item-header">
                        <span class="item-title">${title}</span>
                        ${link ? `<a href="${link}" target="_blank" style="color: #3b82f6;">View Project</a>` : ''}
                    </div>
                    ${tech ? `<div class="item-company">Technologies: ${tech}</div>` : ''}
                    <p>${description}</p>
                </div>
            `;
        }
    });

    document.getElementById("projectSection").style.display = anyContent ? "block" : "none";
}

// Skills Functions
function addSkill(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const input = document.getElementById("skillInput");
        const skill = input.value.trim();
        if (!skill) return;

        // Create skill tag with remove button
        const skillTag = document.createElement("div");
        skillTag.className = "skill-tag";
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button class="skill-remove" onclick="removeSkill(this)">×</button>
        `;
        document.getElementById("skillsList").appendChild(skillTag);

        // Add to preview
        const preview = document.createElement("span");
        preview.textContent = skill;
        document.getElementById("previewSkills").appendChild(preview);
        document.getElementById("skillsSection").style.display = "block";

        input.value = "";
    }
}

function removeSkill(button) {
    const skillTag = button.parentElement;
    const skillText = button.previousElementSibling.textContent;
    
    // Remove from input area
    skillTag.remove();
    
    // Remove from preview
    const previewSkills = document.getElementById("previewSkills");
    const previewSpans = previewSkills.querySelectorAll("span");
    previewSpans.forEach(span => {
        if (span.textContent === skillText) {
            span.remove();
        }
    });
    
    // Hide section if no skills left
    if (previewSkills.children.length === 0) {
        document.getElementById("skillsSection").style.display = "none";
    }
}


// Remove Section Function
function removeSection(button) {
    const section = button.closest('.form-group');
    const type = section.dataset.type;
    section.remove();
    
    // Re-render the appropriate section
    switch(type) {
        case 'experience':
            renderExperiences();
            break;
        case 'education':
            renderEducation();
            break;
        case 'project':
            renderProjects();
            break;
        case 'award':
            renderAwards();
            break;
    }
}

// Template Application
function applyTemplate(templateName) {
    const preview = document.getElementById("resumePreview");
    preview.className = "resume-container " + templateName;
}

// Save and Load Functions
function saveResume() {
    const resumeData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        linkedin: document.getElementById("linkedin").value,
        location: document.getElementById("location").value,
        summary: document.getElementById("summary").value,
        template: document.getElementById("templateSelect").value,
        experiences: [],
        education: [],
        projects: [],
        awards: [],
        skills: []
    };

    // Save experiences
    document.getElementById("experienceContainer").querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        resumeData.experiences.push({
            title: inputs[0].value,
            company: inputs[1].value,
            duration: inputs[2].value,
            description: inputs[3].value
        });
    });

    // Save education
    document.getElementById("educationContainer").querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input");
        resumeData.education.push({
            degree: inputs[0].value,
            institution: inputs[1].value,
            duration: inputs[2].value,
            grade: inputs[3].value
        });
    });

    // Save projects
    document.getElementById("projectsContainer").querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        resumeData.projects.push({
            title: inputs[0].value,
            tech: inputs[1].value,
            description: inputs[2].value,
            link: inputs[3].value
        });
    });

    // Save awards
    document.getElementById("awardsContainer").querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        resumeData.awards.push({
            title: inputs[0].value,
            organization: inputs[1].value,
            date: inputs[2].value,
            description: inputs[3].value
        });
    });

    // Save skills
    document.getElementById("skillsList").querySelectorAll(".skill-tag span").forEach(span => {
        resumeData.skills.push(span.textContent);
    });

    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    alert("Resume saved successfully!");
}

function loadSavedData() {
    const saved = localStorage.getItem("resumeData");
    if (!saved) return;

    const data = JSON.parse(saved);
    
    // Load basic info
    document.getElementById("fullName").value = data.fullName || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("linkedin").value = data.linkedin || "";
    document.getElementById("location").value = data.location || "";
    document.getElementById("summary").value = data.summary || "";
    
    if (data.template) {
        document.getElementById("templateSelect").value = data.template;
        applyTemplate(data.template);
    }

    // Load experiences
    if (data.experiences) {
        data.experiences.forEach(exp => {
            addExperience();
            const container = document.getElementById("experienceContainer");
            const lastGroup = container.lastElementChild;
            const inputs = lastGroup.querySelectorAll("input, textarea");
            inputs[0].value = exp.title || "";
            inputs[1].value = exp.company || "";
            inputs[2].value = exp.duration || "";
            inputs[3].value = exp.description || "";
        });
        renderExperiences();
    }

    // Load education
    if (data.education) {
        data.education.forEach(edu => {
            addEducation();
            const container = document.getElementById("educationContainer");
            const lastGroup = container.lastElementChild;
            const inputs = lastGroup.querySelectorAll("input");
            inputs[0].value = edu.degree || "";
            inputs[1].value = edu.institution || "";
            inputs[2].value = edu.duration || "";
            inputs[3].value = edu.grade || "";
        });
        renderEducation();
    }

    // Load projects
    if (data.projects) {
        data.projects.forEach(proj => {
            addProjects();
            const container = document.getElementById("projectsContainer");
            const lastGroup = container.lastElementChild;
            const inputs = lastGroup.querySelectorAll("input, textarea");
            inputs[0].value = proj.title || "";
            inputs[1].value = proj.tech || "";
            inputs[2].value = proj.description || "";
            inputs[3].value = proj.link || "";
        });
        renderProjects();
    }

    // Load awards
    if (data.awards) {
        data.awards.forEach(award => {
            addAward();
            const container = document.getElementById("awardsContainer");
            const lastGroup = container.lastElementChild;
            const inputs = lastGroup.querySelectorAll("input, textarea");
            inputs[0].value = award.title || "";
            inputs[1].value = award.organization || "";
            inputs[2].value = award.date || "";
            inputs[3].value = award.description || "";
        });
        renderAwards();
    }

    // Load skills
    if (data.skills) {
        data.skills.forEach(skill => {
            const skillTag = document.createElement("div");
            skillTag.className = "skill-tag";
            skillTag.innerHTML = `
                <span>${skill}</span>
                <button class="skill-remove" onclick="removeSkill(this)">×</button>
            `;
            document.getElementById("skillsList").appendChild(skillTag);

            const preview = document.createElement("span");
            preview.textContent = skill;
            document.getElementById("previewSkills").appendChild(preview);
        });
        if (data.skills.length > 0) {
            document.getElementById("skillsSection").style.display = "block";
        }
    }

    updatePreview();
}

// Reset Form
function resetForm() {
    if (!confirm("Are you sure you want to clear all data? This cannot be undone.")) {
        return;
    }

    // Clear all input fields
    document.querySelectorAll("input, textarea").forEach(field => {
        field.value = "";
    });

    // Clear all dynamic sections
    document.getElementById("experienceContainer").innerHTML = "";
    document.getElementById("educationContainer").innerHTML = "";
    document.getElementById("projectsContainer").innerHTML = "";
    document.getElementById("awardsContainer").innerHTML = "";
    document.getElementById("skillsList").innerHTML = "";
          
    // Reset template
    document.getElementById("templateSelect").value = "template-professional";
    applyTemplate("template-professional");

    // Clear localStorage
    localStorage.removeItem("resumeData");

    // Update preview
    updatePreview();
    renderExperiences();
    renderEducation();
    renderProjects();
    renderAwards();
    document.getElementById("previewSkills").innerHTML = "";
    document.getElementById("skillsSection").style.display = "none";

    alert("Form cleared successfully!");
}

// Download Resume (Basic implementation)
function downloadResume() {
    // Simple implementation - you can enhance this with a proper PDF library
    const printWindow = window.open('', '', 'height=800,width=600');
    const resumeContent = document.getElementById("resumePreview").outerHTML;
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Resume</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .resume-container { max-width: 800px; margin: 0 auto; }
                .resume-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; }
                .resume-name { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
                .resume-contact { font-size: 1rem; color: #666; }
                .resume-section { margin-bottom: 1.5rem; }
                .resume-section h3 { font-size: 1.2rem; color: #333; margin-bottom: 1rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
                .experience-item, .education-item, .project-item, .award-item { margin-bottom: 1rem; }
                .item-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                .item-title { font-weight: bold; }
                .item-date { color: #666; }
                .item-company, .item-institution { color: #555; font-weight: 500; }
                .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skills-container span { background: #333; color: white; padding: 0.3rem 0.6rem; border-radius: 15px; font-size: 0.8rem; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>${resumeContent}</body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}