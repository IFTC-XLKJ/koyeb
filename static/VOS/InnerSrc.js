class InnerSrc extends HTMLElement {
    src = "";
    get src() {
        return this.getAttribute("src");
    }
    set src(value) {
        this.setAttribute("src", value);
    }
    static get observedAttributes() {
        return ["src"];
    }
    constructor() {
        super();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "src") {
            this.src = newValue;
        }
    }
}
customElements.define("inner-src", InnerSrc);