class aBanner extends HTMLElement {
    #current = 0;
    get current() {
        return this.#current;
    }
    set current(value) {
        return null;
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const config = { attributes: true, childList: true, subtree: true, characterData: true };
        const self = this;
        const callback = function (mutationsList, observer) {
            self.render();
        };
        const observer = new MutationObserver(callback);
        observer.observe(this, config);
        const slot = document.querySelector('slot');
        setInterval(() => {
            const bannerImgs = this.querySelectorAll('img');
            if (bannerImgs.length > 0) {
                this.#current++;
                if (this.#current >= bannerImgs.length) this.#current = 0;
                if (slot) slot.style.transform = `translateX(-${this.#current * 100}%)`;
            }
        }, 5000);
    }
    render() {
        const bannerContents = this.querySelectorAll('iftc-banner-content');
        if (bannerContents.length == 0) return;
        const bannerImgs = [];
        bannerContents.forEach(bannerContent => {
            const img = bannerContent.getAttribute('img');
            if (img) bannerImgs.push(img);
        });
        if (bannerImgs.length == 0) return;
        const bannerAlts = [];
        bannerContents.forEach(bannerContent => {
            const alt = bannerContent.getAttribute('alt');
            if (alt) bannerAlts.push(alt);
            else bannerAlts.push('Banner Image');
        });
        const bannerLinks = [];
        bannerContents.forEach(bannerContent => {
            const href = bannerContent.getAttribute('href');
            if (href) bannerLinks.push(href);
            else bannerLinks.push('#');
        });
        this.shadowRoot.innerHTML = '';
        const container = document.createElement('div');
        container.setAttribute('class', 'banner-container');
        const slot = document.createElement('slot');
        slot.setAttribute('name', 'banner-content');
        container.appendChild(slot);
        bannerImgs.forEach((imgSrc, imgIndex) => {
            const img = document.createElement('img');
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.setAttribute('src', imgSrc);
            img.setAttribute('class', 'banner-image');
            img.setAttribute("draggable", "false");
            img.setAttribute("loading", "lazy");
            img.setAttribute('alt', bannerAlts[imgIndex]);
            img.setAttribute('target-href', bannerLinks[imgIndex]);
            // img.onclick = e => window.open(bannerLinks[imgIndex], '_blank');
            slot.appendChild(img);
        });
        const style = document.createElement('style');
        style.textContent = `.banner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    width: ${this.getAttribute("width") || "auto"};
}
.banner-image {
    max-width: 100%;
    height: auto;
    border-radius: 7px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    position: relative;
}
slot[name="banner-content"] {
    display: inline-flex;
    overflow: hidden;
    z-index: -1;
}
img {
    transition: left 1s cubic-bezier(0, -0.36, 0, 1);
}`;
        this.shadowRoot.append(style, container);
        let index = 0;
        container.addEventListener("click", e => {
            const imgs = this.shadowRoot.querySelectorAll('.banner-image');
            console.log(imgs[index].getAttribute('target-href'))
            open(imgs[index].getAttribute('target-href'), '_blank');
        })
        const banners = this.shadowRoot.querySelectorAll(".banner-image");
        setInterval(() => {
            banners.forEach((img, i) => {
                img.style.left = `${index * -100}%`;
            });
            index = (index + 1) % banners.length;
        }, 5000)
    }

    connectedCallback() { }

    disconnectedCallback() { }
}

class aBannerContent extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['img', 'alt', 'href'];
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback() { }

    disconnectedCallback() { }
}

customElements.define('iftc-banner', aBanner);
customElements.define('iftc-banner-content', aBannerContent);