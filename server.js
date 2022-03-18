const express = require("express");
const axios = require("axios");
const app = express();
const xlsx = require("node-xlsx");
const excelFilePath = "./CNEW_asat_20220310.xls";
const sheets = xlsx.parse(excelFilePath);
console.log(sheets[0].data);
app.get("/list", async (req, res) => {
  let stockArray = sheets[0].data.slice(2, -1);
  const stockList = [];
  stockArray.forEach((x) => {
    stockList.push(x[2]);
  });
  const finalStr = stockList
    .map((x) =>
      x.charAt(0) == "6" ? "s_sh" + x.split(" ")[0] : "s_sz" + x.split(" ")[0]
    )
    .toString();
  const _url = `https://qt.gtimg.cn/r=0.8409869808238q=${finalStr}`;
  res.send(_url);
});

app.get("/proportion", async (req, res) => {
  let stockArray = sheets[0].data.slice(2, -1);
  const proportionList = [];
  stockArray.forEach((x) => proportionList.push(x[5]));
  res.send(proportionList);
});

app.listen(5000, () => console.log("Listening on port 5000 ..."));
