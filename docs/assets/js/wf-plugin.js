export class Carousel {
    constructor() {
        this.attCurrentSlide = 'data-current-slide';
        this.attPrevious = '[data-id="previous"]';
        this.attNext = '[data-id="next"]';
        this.cssCarouselList = 'carousel__list';
        this.cssCarouselListItem = 'carousel__item';
        this.cssCarouselController = 'carousel__controller';
        this.cssButton = 'carousel__controller-button';
        this.cssButtonActive = `${this.cssButton}--active`;
        this.cssDisplay = 'hide';
        this.cssTransition = '.7s';
        this.elCarousel = document.querySelectorAll('.carousel');

        this.counterCurrent = 0;
        this.transition = 5;
        this.isAutoplay = true;
        this.interval = 1000;

        this.buildNavigationControllerClick = this.buildNavigationControllerClick.bind(this);
    }

    animate(obj) {
        const elCarouselList = obj.from === 'arrow' ?
            obj.target.parentNode.querySelector(`.${this.cssCarouselList}`) :
            obj.target.parentNode.parentNode.querySelector(`.${this.cssCarouselList}`);
        const elCarousel = elCarouselList.parentNode;
        const carouselStyle = elCarousel.getAttribute('data-style');
        const slideSize = Number(elCarouselList.querySelector(`.${this.cssCarouselListItem}`).offsetWidth);
        const currentSlide = obj.currentSlide;
        const currentPosition = Number(currentSlide * slideSize);

        if (carouselStyle === 'fade') {
            this.animateFade({
                elCarouselList,
                currentPosition,
                currentSlide,
            });
            return;
        }

        this.animateSlide({
            elCarouselList,
            currentPosition,
        });
    }

    animateFade(obj) {
        const el = obj.elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);
        const elCurrent = el[obj.currentSlide];

        el.forEach((item) => {
            item.style.opacity = 0;
            item.style.transition = this.cssTransition;
        });

        elCurrent.style.opacity = 1;
        elCurrent.style.left = `-${obj.currentPosition}px`;
        elCurrent.style.transition = this.cssTransition;
    }

    animateSlide(obj) {
        obj.elCarouselList.style.transform = `translateX(-${obj.currentPosition}px)`;
    }

    buildAutoplay() {
        if (!this.isAutoplay) return;

        this.interval = setInterval(this.verifyInterval, this.interval);
        this.isAutoplay = false;
    }

    buildLayout() {
        this.elCarousel.forEach((item) => {
            const el = item.querySelectorAll(`.${this.cssCarouselList} .${this.cssCarouselListItem}`);
            const length = el.length;
            const autoplay = item.getAttribute('data-autoplay');
            const atributte = item.getAttribute(this.attCurrentSlide);

            if (autoplay === 'true') this.buildAutoplay();

            this.resize(item);
            this.buildController(item, length);
            this.defineActive(item.querySelector(`[data-id="${atributte}"]`));

            if (length === 1) {
                item.querySelector(this.attPrevious).classList.add(this.cssDisplay);
                item.querySelector(this.attNext).classList.add(this.cssDisplay);
                item.querySelector(`.${this.cssCarouselController}`).classList.add(this.cssDisplay);
            }
        });
    }

    buildController(target, length) {
        const css = `button button--small button--small--proportional ${this.cssButton}`;
        const elController = target.querySelector(`.${this.cssCarouselController}`);
        let html = '';

        for (let i = 0; i < length; i++) {
            html += `<button type="button"  class="${css}" data-id="${i}" aria-hidden="true"></button>`;
        }

        elController.innerHTML = html;
    }

    buildNavigation() {
        this.elCarousel.forEach((item) => {
            this.buildNavigationController(item);
            this.buildNavigationLeft(item);
            this.buildNavigationRight(item);
        });
    }

    buildNavigationController(target) {
        const elButton = target.querySelectorAll(`.${this.cssButton}`);

        elButton.forEach((item) => {
            helper.addClick(item, this.buildNavigationControllerClick);
        });
    }

    buildNavigationControllerClick(el) {
        const target = el.target;
        const dataId = el.target.getAttribute('data-id');
        const elCarousel = target.parentNode.parentNode;

        elCarousel.setAttribute(this.attCurrentSlide, dataId);

        this.defineActive(target);
        this.animate({
            'currentSlide': target.getAttribute('data-id'),
            'target': target,
            'from': 'navigation'
        });
    }

    buildNavigationArrow(obj) {
        obj.button.onclick = () => {
            const elCarousel = obj.button.parentNode.parentNode;
            const elCarouselList = elCarousel.querySelector(`.${this.cssCarouselList}`);
            const elCarouselListLength = Number(elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`).length);
            const currentSlide = Number(elCarousel.getAttribute(this.attCurrentSlide));
            let slide = 0;

            if (obj.side === 'previous') {
                slide = currentSlide === 0 ? elCarouselListLength - 1 : currentSlide - 1;
            } else {
                slide = currentSlide === (elCarouselListLength - 1) ? 0 : currentSlide + 1;
            }

            elCarousel.setAttribute(this.attCurrentSlide, slide);
            this.defineActive(elCarousel.querySelector(`[data-id="${slide}"]`));
            this.animate({
                'currentSlide': slide,
                'target': elCarouselList,
                'from': 'arrow'
            });
        };
    }

    buildNavigationLeft(target) {
        const button = target.querySelector(this.attPrevious);

        this.buildNavigationArrow({
            button,
            'side': 'previous'
        });
    }

    buildNavigationRight(target) {
        const button = target.querySelector(this.attNext);

        this.buildNavigationArrow({
            button,
            'side': 'next'
        });
    }

    defineActive(target) {
        const el = target.parentNode.parentNode.querySelectorAll(`.${this.cssButton}`);

        el.forEach((item) => {
            item.classList.remove(this.cssButtonActive);
        });

        target.classList.add(this.cssButtonActive);
    }

    init() {
        if (!this.elCarousel) return;

        this.buildLayout();
        this.buildNavigation();
        this.watchResize();
    }

    resize(target) {
        const elCarouselList = target.querySelector(`.${this.cssCarouselList}`);
        const elCarouselListItem = elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);
        const length = elCarouselListItem.length;

        elCarouselList.style.width += `${length * 100}%`;
    }

    verifyInterval() {
        const self = window.carousel;

        self.counterCurrent++;

        if (self.counterCurrent >= self.transition) {
            self.counterCurrent = 0;

            self.elCarousel.forEach((item) => {
                const autoplay = item.getAttribute('data-autoplay');
                const elNext = item.querySelector(self.attNext);

                if (autoplay === 'true') elNext.click();
            });
        }
    }

    watchResize() {
        window.addEventListener('resize', () => {
            this.elCarousel.forEach((item) => {
                this.watchResizeLoop(item);
            });
        }, true);
    }

    watchResizeLoop(item) {
        const el = item.parentNode.parentNode.parentNode.parentNode;
        const elCarouselList = el.querySelector(`.${this.cssCarouselList}`);
        let newSlide = 0;

        this.defineActive(el.querySelector(`[data-id="${newSlide}"]`));
        this.animate({
            'currentSlide': newSlide,
            'target': elCarouselList,
            'from': 'arrow'
        });
    }
}
export class Helper {
    addClass(target, classCss) {
        if (!target || !classCss) return;

        if (classCss instanceof Array) {
            for (let i in classCss) {
                target.classList.add(classCss[i]);
            }

            return;
        }

        target.classList.add(classCss);
    }

    addClick(el, action) {
        if (!el) return;

        this.addEvent({
            el,
            action,
            event: 'click'
        });
    }

    addEvent(args) {
        const action = args.action;
        const el = args.el;
        const event = args.event;

        if (!el) return;

        el.removeEventListener(event, action);
        el.addEventListener(event, action);
    }

    ajax(obj) {
        return new Promise((resolve, reject) => {
            const kind = typeof obj.kind === 'undefined' ? 'POST' : obj.kind;
            let xhr = new XMLHttpRequest();

            xhr.open(kind, obj.controller, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
        });
    }

    capitalize(target) {
        return target.charAt(0).toUpperCase() + target.slice(1);
    }

    getUrlParameter(target) {
        const url = top.location.search.substring(1);
        const parameter = url.split('&');

        for (let i = 0; i < parameter.length; i++) {
            let parameterName = parameter[i].split('=');

            if (parameterName[0] === target) {
                return parameterName[1];
            }
        }
    }

    getUrlWord(target) {
        return new RegExp('\\b' + target + '\\b', 'i').test(window.location.href);
    }

    offset(element) {
        let rect = element.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const obj = {
            'top': rect.top + scrollTop,
            'left': rect.left + scrollLeft,
        };

        return obj;
    }

    removeClass(target, classCss) {
        if (!target || !classCss) return;

        if (classCss instanceof Array) {
            for (let i in classCss) {
                if (target.classList.contains(classCss[i])) {
                    target.classList.remove(classCss[i]);
                }
            }
            return;
        }

        if (target.classList.contains(classCss)) {
            target.classList.remove(classCss);
        }
    }

    verifyUrlRoute(target) {
        const arrFolder = window.location.pathname.split('/');

        if (arrFolder.indexOf(target) > -1) {
            return true;
        } else {
            return false;
        }
    }

    wrapItem(target, cssClass) {
        const wrapper = document.createElement('div');

        wrapper.className = cssClass;
        target.parentNode.insertBefore(wrapper, target);
        wrapper.appendChild(target);
    }
}
export class Layout {
    constructor() {
        this.breakPointExtraSmall = 0;
        this.breakPointSmall = 576;
        this.breakPointMedium = 768;
        this.breakPointBig = 992;
        this.breakPointExtraBig = 1200;
        this.breakPointFullHd = 1920;
    }
}
export class LoadingMain {
    constructor() {
        this.cssHide = 'hide';
        this.cssAnimation = 'animate';

        this.elWrapper = document.querySelector('.loading-main');
        this.elLoading = this.elWrapper.querySelector('.loading');
        this.elBody = document.querySelector('body');
    }

    hide() {
        this.elWrapper.classList.add(this.cssHide);
        this.elLoading.classList.remove(this.cssAnimation);
        this.elBody.style.overflow = 'auto';
    }
}
export class MenuToggle {
    constructor() {
        this.cssButton = 'toggle-menu';
        this.cssOpen = 'toggle-menu__open';
        this.isWatch = false;
        this.handleClick = this.handleClick.bind(this);
    }

    buildMenu() {
        this.elButton.forEach((el) => {
            helper.addClick(el, this.handleClick);
        });
    }

    handleClick(args) {
        const elSibling = args.target.nextElementSibling;
        const isCss = elSibling.classList.contains(this.cssOpen);

        if (isCss) {
            elSibling.classList.remove(this.cssOpen);
            return;
        }
        elSibling.classList.add(this.cssOpen);
    }

    init() {
        this.update();
        this.buildMenu();

        if (!this.isWatch) {
            this.isWatch = true;
            this.watchResize();
        }
    }

    update() {
        this.elButton = document.querySelectorAll(`.${this.cssButton}`);
    }

    reset() {
        this.init();
    }

    watchResize() {
        window.onresize = () => {
            this.init();
        };
    }
}
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