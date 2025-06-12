// Initialize the builder
document.addEventListener('DOMContentLoaded', function() {
    handleTemplateFromURL();
    loadSavedData();
    updatePreview();
    setupValidation();
    checkPageSize();
    initializeTimeline();
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
});
// Auto-apply template based on URL parameter
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get("template");

    const templateSelect = document.getElementById("templateSelect");

    if (templateParam) {
        const className = `template-${templateParam}`;
        templateSelect.value = className;  // set dropdown to match
        applyTemplate(className);          // apply the class
    }
});

function applyTemplate(templateClass) {
    const resume = document.getElementById("resumePreview");

    // Remove existing template-* classes
    resume.classList.forEach(cls => {
        if (cls.startsWith("template-")) {
            resume.classList.remove(cls);
        }
    });

    // Add selected template class
    resume.classList.add(templateClass);
}


// Handle template selection from URL
function handleTemplateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    
    if (template) {
        const templateMap = {
            'modern': 'template-modern',
            'executive': 'template-professional', 
            'minimal': 'template-minimal',
            
        };
        
        const templateClass = templateMap[template] || 'template-professional';
        
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.value = templateClass;
            applyTemplate(templateClass);
        }
    }
}

// Photo Upload Functionality
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showModal('Error', 'Please select a valid image file.');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showModal('Error', 'Image size should be less than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        
        // Update photo preview in form
        const profilePhoto = document.getElementById('profilePhoto');
        const photoPlaceholder = document.getElementById('photoPlaceholder');
        const removeBtn = document.getElementById('removePhotoBtn');
        
        profilePhoto.src = photoData;
        profilePhoto.style.display = 'block';
        photoPlaceholder.style.display = 'none';
        removeBtn.style.display = 'block';
        
        // Store photo data
        localStorage.setItem('resumePhoto', photoData);
        
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    const profilePhoto = document.getElementById('profilePhoto');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const removeBtn = document.getElementById('removePhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    
    profilePhoto.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
    removeBtn.style.display = 'none';
    photoUpload.value = '';
    
    localStorage.removeItem('resumePhoto');
    updatePreview();
}

// Enhanced Live Preview Update
function updatePreview() {
    // Update personal information
    document.getElementById("previewName").innerText = document.getElementById("fullName").value || "Your Name";
    document.getElementById("previewEmail").innerText = document.getElementById("email").value || "your.email@example.com";
    document.getElementById("previewPhone").innerText = document.getElementById("phone").value || "+91 123-456-7890";
    
    // Update LinkedIn with clickable link
    const linkedin = document.getElementById("linkedin").value;
    const linkedinSpan = document.getElementById("previewLinkedin");
    if (linkedin) {
        linkedinSpan.innerHTML = `<a href="${linkedin}" target="_blank" style="color: inherit; text-decoration: underline;">${linkedin}</a>`;
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
    
    // Update additional information
    const additionalInfo = document.getElementById("additionalInfo").value;
    if (additionalInfo) {
        document.getElementById("previewAdditional").innerHTML = additionalInfo.replace(/\n/g, '<br>');
        document.getElementById("additionalSection").style.display = "block";
    } else {
        document.getElementById("additionalSection").style.display = "none";
    }
    
    // Update profile photo
    updateProfilePhoto();
    
    // Check page size
    setTimeout(checkPageSize, 100);
    
    // Update timeline
    updateTimeline();
}

function updateProfilePhoto() {
    const showPhoto = document.getElementById("showPhotoInResume").checked;
    const photoContainer = document.getElementById("profilePhotoContainer");
    const resumePhoto = document.getElementById("resumeProfilePhoto");
    const storedPhoto = localStorage.getItem('resumePhoto');
    
    if (showPhoto && storedPhoto) {
        resumePhoto.src = storedPhoto;
        photoContainer.style.display = "block";
    } else {
        photoContainer.style.display = "none";
    }
}

// Form Validation
function setupValidation() {
    const requiredFields = document.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearError(field));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // URL validation
    else if (fieldType === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }
    
    // Show/hide error
    if (isValid) {
        field.classList.remove('error');
        field.parentElement.classList.add('success');
        hideError(field);
    } else {
        field.classList.add('error');
        field.parentElement.classList.remove('success');
        showError(field, errorMessage);
    }
    
    return isValid;
}

function showError(field, message) {
    const errorDiv = field.parentElement.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError(field) {
    const errorDiv = field.parentElement.querySelector('.error-message');
    errorDiv.style.display = 'none';
}

function clearError(field) {
    field.classList.remove('error');
    field.parentElement.classList.remove('success');
    hideError(field);
}

// Experience Functions
function addExperience() {
    const container = document.getElementById("experienceContainer");
    const index = container.children.length;

    const html = `
        <div class="form-group fade-in" data-type="experience">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label style="margin: 0; font-weight: bold; color: #223030;">Experience ${index + 1}</label>
                <button type="button" class="remove-btn" onclick="removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Job Title *" oninput="renderExperiences()" data-field="title" required>
            <input type="text" placeholder="Company Name *" oninput="renderExperiences()" data-field="company" required>
            <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" oninput="renderExperiences()" data-field="duration">
            <textarea placeholder="Job Description and Key Achievements&#10;" oninput="renderExperiences()" data-field="description" rows="4"></textarea>
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
    
    // Auto-save after adding
    setTimeout(autoSave, 1000);
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
                <div class="experience-item slide-up">
                    <div class="item-header">
                        <span class="item-title">${title || 'Job Title'}</span>
                        <span class="item-date">${duration || 'Duration'}</span>
                    </div>
                    <div class="item-company">${company || 'Company Name'}</div>
                    ${description ? `<div style="margin-top: 0.5rem;">${description.replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `;
        }
    });

    document.getElementById("experienceSection").style.display = anyContent ? "block" : "none";
    updateTimeline();
}

// Education Functions
function addEducation() {
    const container = document.getElementById("educationContainer");
    const index = container.children.length;

    const html = `
        <div class="form-group fade-in" data-type="education">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label style="margin: 0; font-weight: bold; color: #223030;">Education ${index + 1}</label>
                <button type="button" class="remove-btn" onclick="removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Degree/Qualification *" oninput="renderEducation()" required>
            <input type="text" placeholder="Institution/University *" oninput="renderEducation()" required>
            <input type="text" placeholder="Year/Duration (e.g., 2018-2022)" oninput="renderEducation()">
            <input type="text" placeholder="Grade/GPA/Percentage (optional)" oninput="renderEducation()">
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
    
    setTimeout(autoSave, 1000);
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
                <div class="education-item slide-up">
                    <div class="item-header">
                        <span class="item-title">${degree || 'Degree'}</span>
                        <span class="item-date">${duration || 'Year'}</span>
                    </div>
                    <div class="item-institution">${institution || 'Institution'}</div>
                    ${grade ? `<div style="margin-top: 0.5rem; color: #6b7280;">Grade: ${grade}</div>` : ''}
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
        <div class="form-group fade-in" data-type="project">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label style="margin: 0; font-weight: bold; color: #223030;">Project ${index + 1}</label>
                <button type="button" class="remove-btn" onclick="removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Project Title *" oninput="renderProjects()" required>
            <input type="text" placeholder="Technologies Used" oninput="renderProjects()">
            <textarea placeholder="• Project Description and Key Features&#10;• Technical challenges solved&#10;• Results and impact" oninput="renderProjects()" rows="3"></textarea>
            <input type="url" placeholder="Project Link (GitHub, Live Demo, etc.)" oninput="renderProjects()">
        </div>`;
    container.insertAdjacentHTML("beforeend", html);
    
    setTimeout(autoSave, 1000);
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
                <div class="project-item slide-up">
                    <div class="item-header">
                        <span class="item-title">${title || 'Project Title'}</span>
                        ${link ? `<a href="${link}" target="_blank" style="color: #223030;text-decoration: none; font-size: 0.9rem;">View Project →</a>` : ''}
                    </div>
                    ${tech ? `<div class="item-company" >Technologies: ${tech}</div>` : ''}
                    ${description ? `<div style="margin-top: 0.5rem;">${description.replace(/\n/g, '<br>')}</div>` : ''}
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

        // Check for duplicates
        const existingSkills = Array.from(document.querySelectorAll('#skillsList .skill-tag span')).map(span => span.textContent);
        if (existingSkills.includes(skill)) {
            showModal('Duplicate Skill', 'This skill has already been added.');
            input.value = "";
            return;
        }

        // Create skill tag with remove button
        const skillTag = document.createElement("div");
        skillTag.className = "skill-tag fade-in";
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button class="skill-remove" onclick="removeSkill(this)" title="Remove skill">×</button>
        `;
        document.getElementById("skillsList").appendChild(skillTag);

        // Add to preview
        const preview = document.createElement("span");
        preview.textContent = skill;
        preview.className = "slide-up";
        document.getElementById("previewSkills").appendChild(preview);
        document.getElementById("skillsSection").style.display = "block";

        input.value = "";
        autoSave();
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
    
    autoSave();
}

// Timeline Functionality
function initializeTimeline() {
    updateTimeline();
}

function updateTimeline() {
    const timelineContainer = document.getElementById("timelineContainer");
    const experiences = collectExperienceData();
    
    if (experiences.length === 0) {
        timelineContainer.innerHTML = '<p class="timeline-placeholder">Add work experience to see your career timeline</p>';
        return;
    }
    
    timelineContainer.innerHTML = '';
    
    experiences.forEach(exp => {
        if (exp.title && exp.company && exp.duration) {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item fade-in';
            
            // Extract year from duration
            const year = exp.duration.match(/\d{4}/)?.[0] || 'Present';
            
            timelineItem.innerHTML = `
                <div class="timeline-year">${year}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${exp.title}</div>
                    <div class="timeline-company">${exp.company}</div>
                </div>
            `;
            
            timelineContainer.appendChild(timelineItem);
        }
    });
}

function collectExperienceData() {
    const experiences = [];
    const container = document.getElementById("experienceContainer");
    
    container.querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        experiences.push({
            title: inputs[0].value,
            company: inputs[1].value,
            duration: inputs[2].value,
            description: inputs[3].value
        });
    });
    
    return experiences.filter(exp => exp.title || exp.company);
}

// Page Size Check
function checkPageSize() {
    const resumeContainer = document.getElementById("resumePreview");
    const pageIndicator = document.getElementById("pageIndicator");
    
    // Rough calculation for A4 page size
    const a4Height = 1120; // Approximate A4 height in pixels at normal zoom
    const currentHeight = resumeContainer.scrollHeight;
    const pages = Math.ceil(currentHeight / a4Height);
    
    pageIndicator.innerHTML = `<span>Page ${pages > 1 ? `1 of ${pages}` : '1 of 1'}</span>`;
    
    // Show warning if content exceeds one page
    const existingWarning = document.querySelector('.page-overflow-warning');
    if (pages > 1 && !existingWarning) {
        const warning = document.createElement('div');
        warning.className = 'page-overflow-warning';
        warning.innerHTML = `
            ⚠️ Content exceeds one page (${pages} pages). Consider removing some sections for better readability.
            <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; color: inherit; cursor: pointer;">×</button>
        `;
        document.body.appendChild(warning);
        
        // Auto-remove warning after 10 seconds
        setTimeout(() => {
            if (warning.parentElement) {
                warning.remove();
            }
        }, 10000);
    } else if (pages === 1 && existingWarning) {
        existingWarning.remove();
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
    }
    
    // Update numbering
    updateSectionNumbers(type);
    autoSave();
}

function updateSectionNumbers(type) {
    const container = document.getElementById(type + "Container");
    const sections = container.querySelectorAll('.form-group');
    
    sections.forEach((section, index) => {
        const label = section.querySelector('label');
        const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
        label.textContent = `${capitalizedType} ${index + 1}`;
    });
}

// Template Application
function applyTemplate(templateName) {
    const preview = document.getElementById("resumePreview");
    preview.className = "resume-container " + templateName;
    
    // Save template preference
    localStorage.setItem('selectedTemplate', templateName);
    
    // Apply template-specific styling
    setTimeout(updatePreview, 100);
}

// Enhanced Save and Load Functions
function saveResume() {
    if (!validateAllFields()) {
        showModal('Validation Error', 'Please fill in all required fields correctly before saving.');
        return;
    }
    
    const resumeData = collectAllData();
    
    try {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
        showModal('Success', 'Resume saved successfully! Your data is stored locally and will be available next time you visit.');
        
        // Visual feedback
        const saveBtn = document.querySelector('[onclick="saveResume()"]');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '✅ Saved';
        saveBtn.style.background = '#10b981';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
        
    } catch (error) {
        showModal('Error', 'Failed to save resume data. Please try again.');
        console.error('Save error:', error);
    }
}

function autoSave() {
    const resumeData = collectAllData();
    try {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
        localStorage.setItem("lastAutoSave", new Date().toISOString());
    } catch (error) {
        console.error('Auto-save error:', error);
    }
}

function collectAllData() {
    const resumeData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        linkedin: document.getElementById("linkedin").value,
        location: document.getElementById("location").value,
        summary: document.getElementById("summary").value,
        additionalInfo: document.getElementById("additionalInfo").value,
        template: document.getElementById("templateSelect").value,
        showPhoto: document.getElementById("showPhotoInResume").checked,
        experiences: [],
        education: [],
        projects: [],
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

    // Save skills
    document.getElementById("skillsList").querySelectorAll(".skill-tag span").forEach(span => {
        resumeData.skills.push(span.textContent);
    });

    return resumeData;
}

function validateAllFields() {
    const requiredFields = document.querySelectorAll('input[required]');
    let allValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    return allValid;
}

function loadSavedData() {
    const saved = localStorage.getItem("resumeData");
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        
        // Load basic info
        document.getElementById("fullName").value = data.fullName || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("linkedin").value = data.linkedin || "";
        document.getElementById("location").value = data.location || "";
        document.getElementById("summary").value = data.summary || "";
        document.getElementById("additionalInfo").value = data.additionalInfo || "";
        
        // Load photo settings
        if (data.showPhoto !== undefined) {
            document.getElementById("showPhotoInResume").checked = data.showPhoto;
        }
        
        // Load saved photo
        const savedPhoto = localStorage.getItem('resumePhoto');
        if (savedPhoto) {
            const profilePhoto = document.getElementById('profilePhoto');
            const photoPlaceholder = document.getElementById('photoPlaceholder');
            const removeBtn = document.getElementById('removePhotoBtn');
            
            profilePhoto.src = savedPhoto;
            profilePhoto.style.display = 'block';
            photoPlaceholder.style.display = 'none';
            removeBtn.style.display = 'block';
        }
        
        if (data.template) {
            document.getElementById("templateSelect").value = data.template;
            applyTemplate(data.template);
        }

        // Load experiences
        if (data.experiences) {
            data.experiences.forEach(exp => {
                if (exp.title || exp.company || exp.duration || exp.description) {
                    addExperience();
                    const container = document.getElementById("experienceContainer");
                    const lastGroup = container.lastElementChild;
                    const inputs = lastGroup.querySelectorAll("input, textarea");
                    inputs[0].value = exp.title || "";
                    inputs[1].value = exp.company || "";
                    inputs[2].value = exp.duration || "";
                    inputs[3].value = exp.description || "";
                }
            });
            renderExperiences();
        }

        // Load education
        if (data.education) {
            data.education.forEach(edu => {
                if (edu.degree || edu.institution || edu.duration || edu.grade) {
                    addEducation();
                    const container = document.getElementById("educationContainer");
                    const lastGroup = container.lastElementChild;
                    const inputs = lastGroup.querySelectorAll("input");
                    inputs[0].value = edu.degree || "";
                    inputs[1].value = edu.institution || "";
                    inputs[2].value = edu.duration || "";
                    inputs[3].value = edu.grade || "";
                }
            });
            renderEducation();
        }

        // Load projects
        if (data.projects) {
            data.projects.forEach(proj => {
                if (proj.title || proj.tech || proj.description || proj.link) {
                    addProjects();
                    const container = document.getElementById("projectsContainer");
                    const lastGroup = container.lastElementChild;
                    const inputs = lastGroup.querySelectorAll("input, textarea");
                    inputs[0].value = proj.title || "";
                    inputs[1].value = proj.tech || "";
                    inputs[2].value = proj.description || "";
                    inputs[3].value = proj.link || "";
                }
            });
            renderProjects();
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
        
        // Show last save time
        const lastSave = localStorage.getItem("lastAutoSave");
        if (lastSave) {
            const saveTime = new Date(lastSave).toLocaleString();
            console.log(`Resume data loaded. Last saved: ${saveTime}`);
        }
        
    } catch (error) {
        console.error('Error loading saved data:', error);
        showModal('Load Error', 'There was an error loading your saved data. Starting with a fresh form.');
    }
}

// Enhanced Reset Form
function resetForm() {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone and will remove all your entered information.")) {
        return;
    }

    // Clear all input fields
    document.querySelectorAll("input, textarea").forEach(field => {
        field.value = "";
        field.classList.remove('error', 'success');
    });

    // Clear all dynamic sections
    document.getElementById("experienceContainer").innerHTML = "";
    document.getElementById("educationContainer").innerHTML = "";
    document.getElementById("projectsContainer").innerHTML = "";
    document.getElementById("skillsList").innerHTML = "";
    
    // Reset photo
    removePhoto();
    
    // Reset template
    document.getElementById("templateSelect").value = "template-professional";
    applyTemplate("template-professional");
    
    // Reset photo toggle
    document.getElementById("showPhotoInResume").checked = true;

    // Clear localStorage
    localStorage.removeItem("resumeData");
    localStorage.removeItem("resumePhoto");
    localStorage.removeItem("lastAutoSave");

    // Update preview
    updatePreview();
    renderExperiences();
    renderEducation();
    renderProjects();
    document.getElementById("previewSkills").innerHTML = "";
    document.getElementById("skillsSection").style.display = "none";

    // Remove any warnings
    const warning = document.querySelector('.page-overflow-warning');
    if (warning) warning.remove();

    showModal('Success', 'Form cleared successfully! You can start fresh with your resume.');
}

// Enhanced Download Resume with proper PDF generation
async function downloadResume() {
    if (!validateAllFields()) {
        showModal('Validation Error', 'Please complete all required fields before downloading.');
        return;
    }
    
    const downloadBtn = document.querySelector('.download-btn');
    const originalText = downloadBtn.innerHTML;
    
    try {
        // Show loading state
        downloadBtn.innerHTML = '⏳ Generating PDF...';
        downloadBtn.disabled = true;
        downloadBtn.classList.add('loading');
        
        // Save before download
        autoSave();
        
        // Use jsPDF for better PDF generation
        const { jsPDF } = window.jspdf;
        const resumeElement = document.getElementById("resumePreview");
        
        // Create canvas from resume
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: function(clonedDoc) {
                const clonedElement = clonedDoc.getElementById('resumePreview');
                if (clonedElement) {
                    clonedElement.style.transform = 'scale(1)';
                }
            }
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
        const imgX = (pdfWidth - imgWidth * 0.264583 * ratio) / 2;
        const imgY = 5;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * 0.264583 * ratio, imgHeight * 0.264583 * ratio);
        
        // Generate filename
        const name = document.getElementById("fullName").value || "Resume";
        const date = new Date().toISOString().split('T')[0];
        const filename = `${name.replace(/\s+/g, '_')}_Resume_${date}.pdf`;
        
        // Download
        pdf.save(filename);
        
        showModal('Success', `Resume downloaded successfully as ${filename}!`);
        
    } catch (error) {
        console.error('Download error:', error);
        showModal('Error', 'Failed to generate PDF. Please try again or use your browser\'s print function.');
        
        // Fallback to print
        setTimeout(() => {
            if (confirm('Would you like to use the browser print function instead?')) {
                window.print();
            }
        }, 2000);
        
    } finally {
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('loading');
    }
}

// Modal Functions
function showModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = modal.querySelector('h3');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.style.display = 'flex';
    
    // Auto-close after 5 seconds for success messages
    if (title.toLowerCase().includes('success')) {
        setTimeout(closeModal, 5000);
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveResume();
    }
    
    // Ctrl+P to download/print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        downloadResume();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Window beforeunload handler
window.addEventListener('beforeunload', function(e) {
    // Auto-save before leaving
    autoSave();
    
    // Warn if there's unsaved data
    const hasData = document.getElementById("fullName").value || 
                   document.getElementById("email").value || 
                   document.getElementById("phone").value;
    
    if (hasData) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize default sections
setTimeout(() => {
    if (document.getElementById("experienceContainer").children.length === 0) {
        addExperience();
    }
    if (document.getElementById("educationContainer").children.length === 0) {
        addEducation();
    }
}, 500);

// Get template name from URL
const urlParams = new URLSearchParams(window.location.search);
const selectedTemplate = urlParams.get("template");

// Optional: Fallback template
const defaultTemplate = "modern";
const templateToUse = selectedTemplate || defaultTemplate;

// Load the template (you'll define this logic below)
loadTemplate(templateToUse);
function loadTemplate(templateName) {
  const preview = document.getElementById("resume-preview"); // or your main resume wrapper

  // Clear existing template styles (optional if you're swapping classes)
  preview.className = "resume-preview"; // reset base class

  // Apply the appropriate class
  preview.classList.add(`template-${templateName}`);
}