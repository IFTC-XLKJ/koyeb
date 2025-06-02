Blockly.defineBlocksWithJsonArray([
    {
        type: "load_Eruda",
        message0: "加载Eruda控制台",
        previousStatement: null,
        nextStatement: null,
        colour: "#449CD6",
        tooltip: "加载Eruda控制台，建议加载在最前面",
        helpUrl: ""
    },
    {
        type: ""
    }
])
Blockly.JavaScript.forBlock['load_Eruda'] = function (block) {
    const code = `<script src="https://iftc.koyeb.app/static/eruda.min.js" iftc-annotation="Eruda控制台"></script>
<script iftc-annotation="Eruda控制台">eruda.init();</script>`;
    return code;
}