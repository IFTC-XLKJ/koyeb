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
        const srcBlob = API.readFile(new URL(this.src, `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", ""));
        const srcUrl = URL.createObjectURL(srcBlob);
        if (this.type === "js") {
            const script = document.createElement("script");
            script.src = srcUrl;
            this.appendChild(script);
        } else if (this.type === "css") {
            const style = document.createElement("style");
            style.textContent = srcBlob.text;
            this.appendChild(style);
        } else {
            console.error(`InnerSrc: Unsupported type "${this.type}".`);
            return;
        }
    }
}
customElements.define("inner-src", InnerSrc);