document.addEventListener('DOMContentLoaded', () => {

    const navButtons = document.querySelectorAll('.nav-btn');
    const contentWrapper = document.querySelector('.content-wrapper');

    // Function to load a section based on its name
    function loadSection(sectionName) {
        const sectionPath = `sections/${sectionName}.html`;

        fetch(sectionPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch content for ${sectionName}`);
                }
                return response.text();
            })
            .then(htmlContent => {
                // Clear the current content
                contentWrapper.innerHTML = ''; 
                
                // Create a new section and add the loaded content
                const newSection = document.createElement('section');
                newSection.id = sectionName;
                newSection.className = 'content-section visible';
                newSection.innerHTML = htmlContent;
                
                // Add the new section to the content wrapper
                contentWrapper.appendChild(newSection);

                newSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            })
            .catch(error => {
                console.error('Error loading section:', error);
                contentWrapper.innerHTML = `<section class="content-section visible"><h2>Error</h2><p>Failed to load content. Please try again later.</p></section>`;
            });
    }

    // Add click event listeners to all navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Remove 'active' class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            event.currentTarget.classList.add('active');

            // Get the section name from the data attribute and load it
            const sectionName = event.currentTarget.dataset.section;
            loadSection(sectionName);
        });
    });

    // Auto-load the 'home' section on page start
    loadSection('home');
});