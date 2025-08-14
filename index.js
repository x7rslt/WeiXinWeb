const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 静态文件服务
app.use('/AI-icon', express.static(path.join(__dirname, 'AI-icon')));
app.use(express.static(path.join(__dirname, 'public')));

// 简单的内存计数器（用于测试）
let counter = 0;

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    counter++;
  } else if (action === "clear") {
    counter = 0;
  }
  res.send({
    code: 0,
    data: counter,
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  res.send({
    code: 0,
    data: counter,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 3000;

function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
    console.log(`访问地址: http://localhost:${port}`);
  });
}

bootstrap();
