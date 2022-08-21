window.loadingMain = new LoadingMain();
window.carousel = new Carousel();
window.helper = new Helper();

window.addEventListener('load',
    window.carousel.init(),
    window.loadingMain.hide(), {
        once: true
    });