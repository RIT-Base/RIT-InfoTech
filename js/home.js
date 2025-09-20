 (() => {
 const homeBtn = document.getElementById('home-button');
 
 
 //Home-Button function
    homeBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();