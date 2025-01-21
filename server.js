const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./User.js");
const app = express();
app.use(bodyParser.json())
const port = process.env.PORT || 3000;
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.send("IFTC API");
});

app.get("/api", (req, res) => {
  res.json({
    code: 200,
    msg: "请求成功",
    copyright: "IFTC",
    apis: [
      "GET /user/details?id={用户ID(必填)}",
    ],
    timestamp: time(),
  });
});

app.get("/api/user/details", async (req, res) => {
  console.log(req.headers.referer || req.headers.referrer);
  const { id } = req.query;
  console.log(typeof Number(id));
  if (Number.isNaN(Number(id))) {
    res.status(400).json({
      code: 400,
      msg: "id参数类型错误，必须为数值类型",
      timestamp: time(),
    });
  }
  if (id) {
    const user = new User();
    try {
      const json = await user.getByID(id);
      if (json.code == 200) {
        const data = json.fields[0];
        if (!data) {
          res.status(404).json({
            code: 404,
            id: id,
            msg: "账号不存在",
            timestamp: time(),
          });
        }
        res.json({
          code: 200,
          msg: "账号数据获取成功",
          data: {
            ID: data.ID,
            username: String(data.昵称),
            avatar: data.头像,
            VC: data.V币,
            email: data.邮箱,
            VIP: !!data.VIP,
            signed: data.签到,
            op: data.管理员 == 1,
            freezed: data.封号 == 1,
            title: data.头衔,
            titleColor: data.头衔色,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
          timestamp: time(),
        });
      } else {
        res.status(json.code).json({
          code: json.code,
          msg: json.msg,
        });
      }
    } catch (e) {
      res.status(500).json({
        code: 500,
        msg: "服务内部错误，请联系官方(QQ:3164417130)",
        error: String(e),
        timestamp: time(),
      });
    }
  } else {
    res.status(400).json({
      code: 400,
      msg: "缺少id参数",
      timestamp: time(),
    });
  }
});

app.listen(port, () => {
  console.log(`服务器已在端口 ${port} 开启`);
});

function time() {
  return Date.now();
}