window.loadingMain = new LoadingMain();
window.carousel = new Carousel();
window.helper = new Helper();
window.menuToggle = new MenuToggle();

window.addEventListener('load',
    window.carousel.init(),
    window.menuToggle.init(),
    window.loadingMain.hide(), {
        once: true
    });