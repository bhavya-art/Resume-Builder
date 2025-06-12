let isSaved = true;
let currentThemeColor = currentThemeColor || '#2563eb';  // fallback blue

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


function handleTemplateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');

    if (template) {
        const templateMap = {
            'modern': 'template-modern',
            'minimal': 'template-minimal',
            'executive': 'template-professional'
        };

        const templateClass = templateMap[template] || 'template-modern';

        const resumePreview = document.getElementById("resume-preview");
        if (resumePreview) {
            resumePreview.className = "resume-preview"; // Reset
            resumePreview.classList.add(templateClass); // Apply selected
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    handleTemplateFromURL();
});


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
            const experienceHTML = `
                <div class="experience-item slide-up" style="margin-bottom: 1.5rem; padding: 1rem; border-radius: 8px; word-wrap: break-word; overflow-wrap: break-word;">
                    <div class="item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span class="item-title" style="font-weight: 600; color: #111827; font-size: 1rem; word-wrap: break-word; overflow-wrap: break-word; flex: 1; min-width: 0;">${title || 'Job Title'}</span>
                        <span class="item-date" style="color: #6b7280; font-size: 0.9rem; font-weight: 500; word-wrap: break-word; overflow-wrap: break-word; flex-shrink: 0;">${duration || 'Duration'}</span>
                    </div>
                    <div class="item-company" style="color: #374151; font-weight: 500; margin-bottom: 0.5rem; word-wrap: break-word; overflow-wrap: break-word;">${company || 'Company Name'}</div>
                    ${description ? `<div style="margin-top: 0.5rem; word-wrap: break-word; overflow-wrap: break-word; white-space: pre-wrap; line-height: 1.6;">${description}</div>` : ''}
                </div>
            `;
            preview.innerHTML += experienceHTML;
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
            const educationHTML = `
                <div class="education-item slide-up" style="margin-bottom: 1.5rem; padding: 1rem; border-radius: 8px; word-wrap: break-word; overflow-wrap: break-word;">
                    <div class="item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span class="item-title" style="font-weight: 600; color: #111827; font-size: 1rem; word-wrap: break-word; overflow-wrap: break-word; flex: 1; min-width: 0;">${degree || 'Degree'}</span>
                        <span class="item-date" style="color: #6b7280; font-size: 0.9rem; font-weight: 500; word-wrap: break-word; overflow-wrap: break-word; flex-shrink: 0;">${duration || 'Year'}</span>
                    </div>
                    <div class="item-institution" style="color: #374151; font-weight: 500; margin-bottom: 0.5rem; word-wrap: break-word; overflow-wrap: break-word;">${institution || 'Institution'}</div>
                    ${grade ? `<div style="margin-top: 0.5rem; color: #6b7280; word-wrap: break-word; overflow-wrap: break-word;">Grade: ${grade}</div>` : ''}
                </div>
            `;
            preview.innerHTML += educationHTML;
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

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderProjects() {
    const container = document.getElementById("projectsContainer");
    const preview = document.getElementById("previewProjects");
    preview.innerHTML = "";

    let anyContent = false;
    container.querySelectorAll(".form-group").forEach(group => {
        const inputs = group.querySelectorAll("input, textarea");
        const title = escapeHTML(inputs[0].value);
        const tech = escapeHTML(inputs[1].value);
        const description = escapeHTML(inputs[2].value);
        const link = escapeHTML(inputs[3].value);

        if (title || description) {
            anyContent = true;

            const safeColor = typeof currentThemeColor !== 'undefined' ? currentThemeColor : '#2563eb';

            const projectHTML = `
                <div class="project-item slide-up" style="margin-bottom: 1.5rem; padding: 1rem; border-radius: 8px; word-wrap: break-word; overflow-wrap: break-word;">
                    <div class="item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span class="item-title" style="font-weight: 600; color: #111827; font-size: 1rem; word-wrap: break-word; overflow-wrap: break-word; flex: 1; min-width: 0;">${title || 'Project Title'}</span>
                        ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color: ${safeColor}; text-decoration: none; font-size: 0.9rem; overflow-wrap: break-word; flex-shrink: 0;">View Project →</a>` : ''}
                    </div>
                    ${tech ? `<div class="item-company" style="color: #374151; font-weight: 500; margin-bottom: 0.5rem; overflow-wrap: break-word;">Technologies: ${tech}</div>` : ''}
                    ${description ? `<div style="margin-top: 0.5rem; overflow-wrap: break-word; white-space: pre-wrap; line-height: 1.6;">${description}</div>` : ''}
                </div>
            `;
            preview.innerHTML += projectHTML;
        }
    });

    document.getElementById("projectSection").style.display = anyContent ? "block" : "none";
}


// FIXED: Enhanced customization functions that actually work
function setThemeColor(color, darkColor) {
    currentThemeColor = color;
    currentThemeColorDark = darkColor;
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty('--theme-color-dark', darkColor);
    
    // Update active color indicator
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-color') === color) {
            option.classList.add('active');
        }
    });
    
    // Force update all colored elements
    updateAllThemeColors();
}

function setFont(fontFamily) {
    const resume = document.getElementById('resumePreview');
    if (resume) {
        resume.style.fontFamily = fontFamily;
        
        // Also update specific text elements
        const textElements = resume.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
        textElements.forEach(element => {
            element.style.fontFamily = fontFamily;
        });
    }
    
    console.log('Font changed to:', fontFamily);
}

function setFontSize(size) {
    const resume = document.getElementById('resumePreview');
    if (resume) {
        resume.style.fontSize = size + 'px';
        
        // Update specific elements that might need size adjustment
        const nameElement = document.getElementById('previewName');
        if (nameElement) {
            nameElement.style.fontSize = (parseInt(size) + 14) + 'px';
        }
        
        const sectionHeaders = resume.querySelectorAll('.resume-section h3');
        sectionHeaders.forEach(header => {
            header.style.fontSize = (parseInt(size) + 2) + 'px';
        });
    }
    
    // Update display
    document.getElementById('fontSizeDisplay').textContent = size + 'px';
    
    console.log('Font size changed to:', size + 'px');
}

// NEW: Function to update all theme-colored elements
function updateAllThemeColors() {
    // Update skill tags in form
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.style.background = `linear-gradient(135deg, ${currentThemeColor}, ${currentThemeColorDark})`;
    });
    
    // Update skills in preview
    document.querySelectorAll('.skills-container span').forEach(span => {
        span.style.background = `linear-gradient(135deg, ${currentThemeColor}, ${currentThemeColorDark})`;
    });
    
    // Update timeline years
    document.querySelectorAll('.timeline-year').forEach(year => {
        year.style.background = currentThemeColor;
    });
    
    // Update section borders
    document.querySelectorAll('.resume-section h3').forEach(header => {
        header.style.borderBottomColor = currentThemeColor;
    });
    
    // Update experience/education/project borders
    document.querySelectorAll('.experience-item, .education-item, .project-item').forEach(item => {
        item.style.borderLeftColor = currentThemeColor;
    });
    
    // Update timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.borderTopColor = currentThemeColor;
    });
    
    console.log('Theme colors updated to:', currentThemeColor);
}

// Enhanced template color update
function updateTemplateColors(templateClass) {
    const colorMap = {
        'template-professional': ['#2d3748', '#1a202c'],
        'template-modern': ['#118df0', '#2563eb'],
        'template-minimal': ['#718096', '#4a5568'],
        'template-executive': ['#8b5fbf', '#7c3aed']
    };
    
    const colors = colorMap[templateClass] || ['#2d3748', '#1a202c'];
    
    // Set the theme colors
    setThemeColor(colors[0], colors[1]);
}

// Enhanced apply template function
function applyTemplate(templateClass) {
    const resume = document.getElementById("resumePreview");
    
    // Remove existing template classes
    resume.className = resume.className.replace(/template-\w+/g, '');
    
    // Add new template class
    resume.classList.add('resume-container', templateClass);
    
    // Update theme colors based on template
    updateTemplateColors(templateClass);
    
    // Save template preference
    localStorage.setItem('selectedTemplate', templateClass);
    
    // Force update after template change
    setTimeout(() => {
        updateAllThemeColors();
        updatePreview();
    }, 100);
    
    console.log('Template applied:', templateClass);
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
// FIXED: Save Function with only success alert
function saveResume() {
    const resumeData = collectAllData();
    
    try {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
        
        // Show success modal
        showModal('Success', 'Resume saved successfully!');
        
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
        console.error('Save error:', error);
        
        // Simple error feedback without modal - just visual
        const saveBtn = document.querySelector('[onclick="saveResume()"]');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '❌ Error';
        saveBtn.style.background = '#ef4444';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
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
// FIXED: Download Resume with only success alert
async function downloadResume() {
    const downloadBtn = document.querySelector('.download-btn');
    const originalText = downloadBtn.innerHTML;
    
    try {
        // Show loading state
        downloadBtn.innerHTML = 'Generating PDF...';
        downloadBtn.disabled = true;
        downloadBtn.classList.add('loading');
        
        // Save before download (no validation required)
        const resumeData = collectAllData();
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
        
        // Use jsPDF for better PDF generation
        const { jsPDF } = window.jspdf;
        const resumeElement = document.getElementById("resumePreview");
        
        // Create canvas from resume
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: function(clonedDoc) {
                const clonedElement = clonedDoc.getElementById('resumePreview');
                if (clonedElement) {
                    clonedElement.style.transform = 'scale(1)';
                    clonedElement.style.width = '800px';
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
        
        // Show success modal
        showModal('Success', `Resume downloaded successfully as ${filename}!`);
        
        // Visual feedback
        downloadBtn.innerHTML = '✅ Downloaded';
        downloadBtn.style.background = '#10b981';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.background = '';
            downloadBtn.disabled = false;
            downloadBtn.classList.remove('loading');
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        
        // Error feedback without modal - just visual
        downloadBtn.innerHTML = '❌ Failed';
        downloadBtn.style.background = '#ef4444';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.background = '';
            downloadBtn.disabled = false;
            downloadBtn.classList.remove('loading');
        }, 3000);
        
        // Fallback to print after showing error
        setTimeout(() => {
            window.print();
        }, 1000);
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

const urlParams = new URLSearchParams(window.location.search);
const selectedTemplate = urlParams.get("template");

const defaultTemplate = "modern";
const templateToUse = selectedTemplate || defaultTemplate;

loadTemplate(templateToUse);

function loadTemplate(templateName) {
    const preview = document.getElementById("resumePreview"); // ✅ use the correct ID

    preview.className = "resume-container"; // reset base class
    preview.classList.add(`template-${templateName}`); // apply template class like "template-modern"
}
