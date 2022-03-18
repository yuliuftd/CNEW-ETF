import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Card, Divider } from "antd";

const list_url = "http://localhost:3000/list";
const proportion_url = "http://localhost:3000/proportion";
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
  {
    title: "净值占比",
    dataIndex: "proportion",
    key: "proportion",
  },
];
export default function StockTable() {
  const [uri, setUri] = useState("");
  const [ratio, setRatio] = useState("");
  const [data, setData] = useState([
    {
      index: 1,
      stockName: "贵州茅台",
      stockCode: "600519",
      close: 2015,
      priceChange: -12,
      precentageChange: "1%",
      capital: 20000,
      proportion: "2%",
    },
  ]);
  useEffect(() => {
    axios
      .get(list_url)
      .then((res) => setUri(res.data))
      .catch((err) => console.log(err));
    axios
      .get(proportion_url)
      .then((res) => setRatio(res.data))
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
            proportion: ratio[index],
          };
        });
        debugger;
        setData(stockArr);
        console.log(stockArr);
      })
      .catch((error) => console.log(error));
  };
  const calculateNetAsset = () => {};
  return (
    <div>
      <Row gutter={16} style={{ backgroundColor: "#1890ff" }}>
        <Col span={8}>
          <Card title="昨日净值" hoverable={true} style={{ width: "100%" }}>
            <p>1.2</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="汇率波动" hoverable={true} style={{ width: "100%" }}>
            <p>-2%</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="今日预估" hoverable={true} style={{ width: "100%" }}>
            <p>-2%</p>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Button onClick={() => SearchAllStocks()} type="primary">
        Fetch Stock Data
      </Button>

      {data && data.length !== 0 ? (
        <Table
          dataSource={data}
          columns={colums}
          pagination={{ pageSize: 60 }}
        />
      ) : null}
    </div>
  );
}
