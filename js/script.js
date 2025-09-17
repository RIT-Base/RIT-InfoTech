document.addEventListener('DOMContentLoaded', () => {
    // Get the start button and both screen containers
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');
    const footer = document.querySelector('footer');

    // Add a click event listener to the start button
    startBtn.addEventListener('click', () => {
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.classList.remove('visible');
            startScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.style.animation = 'fadeIn 1s forwards';
            footer.classList.remove('footer-hidden');
        }, 500);
    });

    // Get all navigation buttons and all content sections
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentWrapper = document.querySelector('.content-wrapper'); // used for section injection
    const headerImage = document.getElementById('header-image');

    // Define the image paths for each section
    const imagePaths = {
        'home': 'img/test-image.webp',
        'webdev': 'img/img2.webp',
        'gamedev': 'img/img3.webp',
        'iot': 'img/img4.webp',
        'cysec': 'img/img5.webp'
    };

    // Function to handle the tab switching
    const switchSection = (targetSectionId) => {
        const sections = contentWrapper.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('visible'));

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) targetSection.classList.add('visible');

        headerImage.classList.add('is-loading');
        setTimeout(() => {
            headerImage.src = imagePaths[targetSectionId];
            headerImage.classList.remove('is-loading');
        }, 100);
    };

    // Function to load a script dynamically (Option A)
    const loadScript = (scriptUrl) => {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true; // allows multiple loads safely
        document.body.appendChild(script);
    };

    // Function to load a section
    const loadSection = (sectionName) => {
        fetch(`sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Could not fetch content for ${sectionName}`);
                return response.text();
            })
            .then(htmlContent => {
                contentWrapper.innerHTML = '';
                const newSection = document.createElement('section');
                newSection.id = sectionName;
                newSection.className = 'content-section visible';
                newSection.innerHTML = htmlContent;
                contentWrapper.appendChild(newSection);
                newSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                if (sectionName === 'webdev') {
                    loadScript('js/webdev.js');
                } else if (sectionName === 'gamedev') {
                    loadScript('js/gamedev.js');
                } else if (sectionName === 'iot') {
                    loadScript('js/iot.js');
                } else if (sectionName === 'cysec') {
                    loadScript('js/cysec.js');
                }

            })
            .catch(error => {
                console.error('Error loading section:', error);
                contentWrapper.innerHTML = `<section class="content-section visible"><h2>Error</h2><p>Failed to load content. Please try again later.</p></section>`;
            });
    };

    // Add click events to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const sectionId = button.getAttribute('data-section');
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadSection(sectionId);
            switchSection(sectionId);

            // Optional: smooth scroll for mobile
            if (window.innerWidth <= 600) {
                document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Auto-load home section on start
    loadSection('home');
});
