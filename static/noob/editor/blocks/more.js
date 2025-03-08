Blockly.defineBlocksWithJsonArray([
    {
        type: "load_Eruda",
        message0: "加载Eruda控制台",
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: "加载Eruda控制台",
        helpUrl: ""
    },
])
Blockly.JavaScript.forBlock['load_Eruda'] = function (block) {
    const code = `<script>const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/eruda';
script.onload = () => {
    eruda.init()
};
document.head.appendChild(script);</script>`;
    return code;
}