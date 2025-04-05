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
    const code = `<script src="/static/eruda.min.js"></script>
<script>eruda.init();</script>`;
    return code;
}