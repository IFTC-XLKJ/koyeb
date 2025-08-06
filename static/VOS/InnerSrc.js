class InnerSrc extends HTMLElement {
    static get observedAttributes() {
        return ["src"];
    }
    constructor() {
        super();
    }
}
customElements.define("inner-src", InnerSrc);