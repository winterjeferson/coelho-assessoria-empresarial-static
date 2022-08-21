window.carousel = new Carousel();
window.form = new Form();
window.helper = new Helper();
window.layout = new Layout();
window.lazyLoad = new LazyLoad();
window.loadingMain = new LoadingMain();
window.mask = new Mask();
window.menuDropDown = new MenuDropDown();
window.menuTab = new MenuTab();
window.menuToggle = new MenuToggle();
window.modal = new Modal();
window.notification = new Notification();
window.table = new Table();
window.tag = new Tag();
window.translation = new Translation();


window.addEventListener('load',
    window.translation.init(),
    window.mask.init(),
    window.modal.init(),
    window.carousel.init(),
    window.lazyLoad.init(),
    window.menuDropDown.init(),
    window.menuTab.init(),
    window.menuToggle.init(),
    window.notification.init(),
    window.table.init(),
    window.tag.init(),
    window.loadingMain.hide(), {
        once: true
    });