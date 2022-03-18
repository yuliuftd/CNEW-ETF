import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "antd";

const list_url = "http://localhost:3000/list";
const colums = [
  {
    title: "编号",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "代码",
    dataIndex: "stockCode",
    key: "stockCode",
  },
  {
    title: "名称",
    dataIndex: "stockName",
    key: "stockName",
  },
  {
    title: "收盘价",
    dataIndex: "close",
    key: "close",
  },
  {
    title: "涨跌幅",
    dataIndex: "precentageChange",
    key: "precentageChange",
  },
  {
    title: "价格变化",
    dataIndex: "priceChange",
    key: "priceChange",
  },
];
export default function StockTable() {
  const [uri, setUri] = useState("");
  const [data, setData] = useState([
    {
      index: 1,
      stockName: "贵州茅台",
      stockCode: "600519",
      close: 2015,
      priceChange: -12,
      precentageChange: "1%",
      capital: 20000,
    },
  ]);
  useEffect(() => {
    axios
      .get(list_url)
      .then((res) => setUri(res.data))
      .catch((err) => console.log(err));
  });
  const SearchAllStocks = () => {
    axios
      .get(uri)
      .then((res) => {
        let originalArr = res.data.split(";\n").slice(0, -1);
        let stockArr = originalArr.map((x, index) => {
          let strArr = x.split("~");
          return {
            index: (index + 1) * 1,
            stockName: strArr[1],
            stockCode: strArr[2],
            close: strArr[3],
            priceChange: strArr[4],
            precentageChange: `${strArr[5]}%`,
            capital: strArr[9],
          };
        });
        debugger;
        setData(stockArr);
        console.log(stockArr);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <Button onClick={() => SearchAllStocks()} type="primary">
        Fetch Stock Data
      </Button>
      {data && data.length !== 0 ? (
        <Table dataSource={data} columns={colums} />
      ) : null}
    </div>
  );
}
