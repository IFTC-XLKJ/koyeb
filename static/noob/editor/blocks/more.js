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
Blockly.JavaScript.forBlock['Eruda控制台'] = function (block) {
    const code = `const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/eruda';
script.onload = () => {
    eruda.init()
};
document.head.appendChild(script);`;
    return code;
}