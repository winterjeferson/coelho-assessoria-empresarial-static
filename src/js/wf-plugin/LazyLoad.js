export class LazyLoad {
    constructor() {
        this.cssAttribute = 'data-lazy-load';
        this.cssData = `[${this.cssAttribute}="true"]`;
    }

    addListener() {
        const elBody = document.querySelector('body');

        elBody.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                this.buildLoop();
            });
        });
    }

    buildLoop() {
        const el = document.querySelectorAll(this.cssData);

        el.forEach((item) => {
            this.verifyPosition(item);
        });
    }

    buildImage(target) {
        const src = target.getAttribute('data-src');

        target.setAttribute('src', src);
        target.removeAttribute(this.cssAttribute);
    }

    init() {
        if (!document.querySelector(this.cssData)) return;

        this.addListener();
        this.buildLoop();
    }

    verifyPosition(target) {
        const windowScroll = window.scrollY;
        const elemntPosition = window.helper.offset(target).top;
        const margin = window.outerHeight;

        if (windowScroll >= elemntPosition - margin) this.buildImage(target);
    }
}