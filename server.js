const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const xlsx = require("node-xlsx");
const excelFilePath = "./CNEW_asat_20220318.xls";
const sheets = xlsx.parse(excelFilePath);

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
  stockArray.forEach((x) =>
    proportionList.push({
      proportion: x[5],
      marketValue: x[4],
      sharesHolding: x[3],
    })
  );
  res.send(proportionList);
});

app.get("/yesMarketValue", async (req, res) => {
  let stockArray = sheets[0].data.slice(2);
  let total = 0;
  stockArray.forEach((x) => (total += x[4].match(/[0-9]/g).join("") / 100));
  res.send(total.toFixed(2).toString());
});

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("Client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));
