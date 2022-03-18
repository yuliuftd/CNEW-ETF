import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Card, Divider, Input, Statistic } from "antd";

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
  //返回包含120支股的query的url
  const [uri, setUri] = useState("");
  //每只股票在基金净值中占比的数列
  const [ratio, setRatio] = useState("");
  //当日汇率变动
  const [xRatechange, setxRatechange] = useState("");
  //昨日收盘净值
  const [yes_Net, setYes_Net] = useState("");
  //今日预估净值
  const [today_Net, setToday_Net] = useState(1);
  //生成股票表格需要的数据（占比部分除外， 有单独的接口推送）
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
        setData(stockArr);
        console.log(stockArr);
      })
      .catch((error) => console.log(error));
  };
  const calNetAssetWithoutXRate = () => {
    if (data && ratio) {
      let sum = 0.013; //剩余现金等价物
      for (let i = 0; i < data.length; i++) {
        debugger;
        let a = data[i].precentageChange.split("%")[0] / 100;
        let b = ratio[i].split("%")[0] / 100;
        sum = sum + b * (1 + a);
      }
      setToday_Net(sum);
    }
  };
  return (
    <div>
      <Row gutter={16} style={{ backgroundColor: "#1890ff" }}>
        <Col span={8}>
          <Card title="昨日净值" hoverable={true} style={{ width: "100%" }}>
            <Input
              onChange={(e) => setYes_Net(e.target.value)}
              value={yes_Net}
              type="number"
              placeholder="请输入昨日净值"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="CNY/AUD汇率波动 %"
            hoverable={true}
            style={{ width: "100%" }}
          >
            <Input
              onChange={(e) => setxRatechange(e.target.value)}
              value={xRatechange}
              type="number"
              placeholder="请输入汇率变动"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="今日净值预估" hoverable={true} style={{ width: "100%" }}>
            <Row>
              <Col style={{ marginRight: 10, textAlign: "center" }}>
                <Button type="primary" onClick={calNetAssetWithoutXRate}>
                  计算（不含汇率）
                </Button>
                <Statistic title="Net Asset" value={today_Net * yes_Net} />
              </Col>
              <Col style={{ marginRight: 10, textAlign: "center" }}>
                <Button type="primary">计算（包含汇率）</Button>
                <Statistic
                  title="Net Asset"
                  value={today_Net * yes_Net * (1 + xRatechange / 100)}
                />
              </Col>
            </Row>
            <Row></Row>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Button
        onClick={() => SearchAllStocks()}
        type="primary"
        style={{ marginBottom: 30 }}
      >
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
