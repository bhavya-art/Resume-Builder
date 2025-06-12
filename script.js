function handleTemplateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');

    if (template) {
        const templateMap = {
            'modern': 'template-modern',
            'minimal': 'template-minimal',
            'executive': 'template-executive'
        };

        const templateClass = templateMap[template] || 'template-modern';

        const resumePreview = document.getElementById("resumePreview");
        if (resumePreview) {
            resumePreview.className = "resumePreview"; // Reset
            resumePreview.classList.add(templateClass); // Apply selected
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    handleTemplateFromURL();
});
