const { urlencoded, json } = require("express");
const express = require("express");
const app = express();
const router = require("./src/route/index.route");
const cors = require("cors");
require("dotenv").config();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use("/api/v1/", router);
app.use(
  cors({
    origin: ["hinatazaka46.jp"],
  })
);
app.use(cors());

app.get("*", (req, res) => {
  return res.send({
    status: 404,
    message: "not found",
  });
});

app.listen(3000, (req, res) => {
  console.log("backend successfully running on port 3000");
});

//defaultnya express js itu ga menerima semua jenis form.
// use() middleware urlencoded, json
//menerima application/x-www-form-urlencoded
//menerima json
