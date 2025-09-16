document.addEventListener('DOMContentLoaded', () => {
    // Get the start button and both screen containers
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');

    // Add a click event listener to the start button
    startBtn.addEventListener('click', () => {
        // Hide the start screen with a fade-out effect
        startScreen.style.opacity = '0';
        
        // Use a timeout to remove the element after the animation finishes
        setTimeout(() => {
            startScreen.classList.remove('visible');
            startScreen.style.display = 'none'; // Ensure it's fully gone
            
            // Show the main content and trigger the fade-in animation
            mainContent.classList.remove('hidden');
            mainContent.style.animation = 'fadeIn 1s forwards';
        }, 500); // This should match the CSS transition duration
    });
    // Get all navigation buttons and all content sections
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const headerImage = document.getElementById('header-image');

    // Define the image paths for each section
    const imagePaths = {
        'home': 'img/test-image.webp',
        'outreach': 'img/img2.webp',
        'marketing': 'img/img3.webp',
        'finance': 'img/img4.webp',
        'technology': 'img/img5.webp'
    };

    // Function to handle the tab switching
    const switchSection = (targetSectionId) => {
        // First, hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('visible');
        });

        // Then, show the targeted section
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('visible');
        }

         // Start fade-out effect
        headerImage.classList.add('is-loading');

        // Change the header image source after a slight delay
        setTimeout(() => {
            headerImage.src = imagePaths[targetSectionId];
            // Remove the loading class to trigger the fade-in
            headerImage.classList.remove('is-loading');
        }, 100);
    };

    // Add a click event listener to each navigation button
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the section ID from the button's data-section attribute
            const sectionId = button.getAttribute('data-section');

            // Remove 'active' class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Call the function to switch the content
            switchSection(sectionId);
        });
    });

    // Optional: Smooth scroll to the content section on mobile
    if (window.innerWidth <= 600) {
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mainElement = document.querySelector('main');
                mainElement.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
});