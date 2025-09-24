document.addEventListener('DOMContentLoaded', () => {
    // Bagian start screen (tidak diubah)
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

    // Variabel utama
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentWrapper = document.querySelector('.content-wrapper');
    const headerImage = document.getElementById('header-image');

    // Path untuk gambar header
    const imagePaths = {
        'home': 'img/test-image.webp',
        'webdev': 'img/img2.webp',
        'gamedev': 'img/img3.webp',
        'iot': 'img/img4.webp',
        'cysec': 'img/img5.webp'
    };

    // Path untuk ikon .webp di tombol navigasi
    const iconPaths = {
        'webdev': { active: 'img/webn.webp', inactive: 'img/weba.webp' },
        'gamedev': { active: 'img/gamen.webp', inactive: 'img/gamea.webp' },
        'iot': { active: 'img/iotn.webp', inactive: 'img/iota.webp' },
        'cysec': { active: 'img/cysecn.webp', inactive: 'img/cyseca.webp' }
    };

    // Fungsi untuk mengganti gambar header
    const switchSection = (targetSectionId) => {
        headerImage.classList.add('is-loading');
        setTimeout(() => {
            if (imagePaths[targetSectionId]) {
                headerImage.src = imagePaths[targetSectionId];
            }
            headerImage.classList.remove('is-loading');
        }, 100);
    };
    
    // Fungsi untuk memuat script eksternal
    const loadScript = (scriptUrl) => {
        // Hapus script lama jika ada untuk menghindari duplikasi
        const oldScript = document.querySelector(`script[src="${scriptUrl}"]`);
        if (oldScript) {
            oldScript.remove();
        }
        // Buat dan tambahkan script baru
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        document.body.appendChild(script);
    };

    // Fungsi untuk memuat konten section dari file HTML
    const loadSection = (sectionName) => {
        fetch(`sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Could not fetch content for ${sectionName}`);
                return response.text();
            })
            .then(htmlContent => {
                contentWrapper.innerHTML = htmlContent;
                // Memuat script spesifik setelah konten berhasil dimuat
                const scripts = {
                    'webdev': 'js/webdev.js',
                    'gamedev': 'js/gamedev.js',
                    'iot': 'js/iot.js',
                    'cysec': 'js/cysec.js',
                    'home': 'js/home.js'
                };
                if (scripts[sectionName]) {
                    loadScript(scripts[sectionName]);
                }
            })
            .catch(error => {
                console.error('Error loading section:', error);
                contentWrapper.innerHTML = `<section class="content-section visible"><h2>Error</h2><p>Gagal memuat konten. Silakan coba lagi nanti.</p></section>`;
            });
    };

    // Event listener untuk setiap tombol navigasi
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickedButton = e.currentTarget;
            const sectionId = clickedButton.dataset.section;

            // 1. Reset semua tombol ke status tidak aktif
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                const btnSection = btn.dataset.section;

                // Hanya ubah gambar jika BUKAN tombol 'home'
                if (btnSection !== 'home') {
                    const icon = btn.querySelector('img');
                    if (icon && iconPaths[btnSection]) {
                        icon.src = iconPaths[btnSection].inactive;
                    }
                }
            });

            // 2. Atur tombol yang diklik menjadi aktif
            clickedButton.classList.add('active');
            // Hanya ubah gambar jika tombol yang diklik BUKAN 'home'
            if (sectionId !== 'home') {
                const clickedIcon = clickedButton.querySelector('img');
                if (clickedIcon && iconPaths[sectionId]) {
                    clickedIcon.src = iconPaths[sectionId].active;
                }
            }

            // 3. Muat konten dan ganti gambar header
            loadSection(sectionId);
            switchSection(sectionId);
        });
    });

    // Muat section 'home' saat halaman pertama kali dibuka
    loadSection('home');
});