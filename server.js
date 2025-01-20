const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/api", (req, res) => {
  res.json({
    code: 200,
    msg: "请求成功",
    copyright: "IFTC",
    apis: [
      // "GET /user/details?id={用户ID(必填)}",
      // "GET /user/login?user={用户ID或昵称或邮箱(必填)}&password={密码(必填)}",
      // "GET /user/register?nickname={昵称(必填)}&email={邮箱(必填)}&password={密码(必填)}&avatar={头像(选填)}",
      // "GET /user/update?type={更新类型，包括：nickname、avatar、email、password(必填)}&id={用户ID(必填)}&password={密码(必填)}&data={要更新内容(必填)}",
    ],
    timestamp: time(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
