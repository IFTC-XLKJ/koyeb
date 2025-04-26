var { window, document } = this;
var { fetch, console } = window;

const METHOD_COLOR = '#1E90FF';

function importScript(src, load, error) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = load;
    script.onerror = error;
    document.head.appendChild(script);
}

const types = {
    isInvisibleWidget: true,
    type: "THREEJS",
    icon: "https://cdn.jsdelivr.net/gh/IFTC/IFTC@latest/static/noob/editor/blocks/icons/threejs.svg",
    author: "IFTC",
}