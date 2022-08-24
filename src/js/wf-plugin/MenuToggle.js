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