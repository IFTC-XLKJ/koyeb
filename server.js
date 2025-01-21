const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("IFTC API");
});

app.get("/api", (req, res) => {
  res.json({
    code: 200,
    msg: "请求成功",
    copyright: "IFTC",
    apis: [],
    timestamp: time(),
  });
});

app.listen(port, () => {
  console.log(`服务器已在端口 ${port} 开启`);
});

function time() {
  return Date.now();
}
