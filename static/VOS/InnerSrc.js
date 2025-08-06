class InnerSrc extends HTMLElement {
    src = "";
    type = "js";
    get src() {
        return this.getAttribute("src");
    }
    set src(value) {
        this.setAttribute("src", value);
    }
    static get observedAttributes() {
        return ["src", "type"];
    }
    constructor() {
        super();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (newValue.trim() === "") {
            console.warn(`InnerSrc: ${name} attribute is empty.`);
            return;
        }
        if (name === "src") {
            this.src = newValue;
            this.load();
        }
    }
    load() {
        const 
        if (this.src) {
            const script = document.createElement("script");
            script.src = this.src;
            script.type = this.type;
            this.appendChild(script);
        } else {
            console.warn("InnerSrc: src attribute is not set.");
        }
    }
}
customElements.define("inner-src", InnerSrc);