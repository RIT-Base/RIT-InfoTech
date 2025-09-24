document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');
    const footer = document.querySelector('footer');

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

    const navButtons = document.querySelectorAll('.nav-btn');
    const contentWrapper = document.querySelector('.content-wrapper');
    const headerImage = document.getElementById('header-image');

    const imagePaths = {
        'home': 'img/test-image.webp',
        'webdev': 'img/img2.webp',
        'gamedev': 'img/img3.webp',
        'iot': 'img/img4.webp',
        'cysec': 'img/img5.webp'
    };

    // ✨ BARU: Path ikon tidak lagi menyertakan 'home'
    const iconPaths = {
        'webdev': { active: 'img/webn.webp', inactive: 'img/weba.webp' },
        'gamedev': { active: 'img/gamen.webp', inactive: 'img/gamea.webp' },
        'iot': { active: 'img/iotn.webp', inactive: 'img/iota.webp' },
        'cysec': { active: 'img/cysecn.webp', inactive: 'img/cyseca.webp' }
    };

    const switchSection = (targetSectionId) => {
        headerImage.classList.add('is-loading');
        setTimeout(() => {
            headerImage.src = imagePaths[targetSectionId];
            headerImage.classList.remove('is-loading');
        }, 100);
    };

    const loadScript = (scriptUrl) => {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        document.body.appendChild(script);
    };

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

                if (sectionName === 'webdev') loadScript('js/webdev.js');
                else if (sectionName === 'gamedev') loadScript('js/gamedev.js');
                else if (sectionName === 'iot') loadScript('js/iot.js');
                else if (sectionName === 'cysec') loadScript('js/cysec.js');
                else if (sectionName === 'home') loadScript('js/home.js');
            })
            .catch(error => {
                console.error('Error loading section:', error);
                contentWrapper.innerHTML = `<section class="content-section visible"><h2>Error</h2><p>Failed to load content. Please try again later.</p></section>`;
            });
    };

    // ✨ DIPERBARUI: Event listener dengan kondisi untuk mengabaikan 'home'
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickedButton = e.currentTarget;
            const sectionId = clickedButton.dataset.section;

            // Reset semua tombol ke status tidak aktif
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                const btnSection = btn.dataset.section;

                // Hanya ubah gambar jika BUKAN tombol home
                if (btnSection !== 'home') {
                    const icon = btn.querySelector('img');
                    if (icon && iconPaths[btnSection]) {
                        icon.src = iconPaths[btnSection].inactive;
                    }
                }
            });

            // Atur tombol yang diklik menjadi aktif
            clickedButton.classList.add('active');

            // Hanya ubah gambar jika tombol yang diklik BUKAN home
            if (sectionId !== 'home') {
                const clickedIcon = clickedButton.querySelector('img');
                if (clickedIcon && iconPaths[sectionId]) {
                    clickedIcon.src = iconPaths[sectionId].active;
                }
            }

            loadSection(sectionId);
            switchSection(sectionId);

            if (window.innerWidth <= 600) {
                document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    loadSection('home');
});