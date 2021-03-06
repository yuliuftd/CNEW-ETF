import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Card, Divider, Input, Statistic } from "antd";

const list_url = "/list";
const proportion_url = "/proportion";
const value_url = "/yesMarketValue";
const colums = [
  {
    title: "编号",
    dataIndex: "key",
    key: "key",
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
    title: "持股",
    dataIndex: "sharesHolding",
    key: "sharesHolding",
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
    title: "昨日净值占比",
    dataIndex: "proportion",
    key: "proportion",
  },
  {
    title: "昨日持仓市值(澳币)",
    dataIndex: "marketValue",
    key: "marketValue",
  },
  {
    title: "预计持仓市值(澳币)",
    dataIndex: "predictMarketValue",
    key: "predictMarketValue",
  },
];
export default function StockTable() {
  //返回包含120支股的query的url
  const [uri, setUri] = useState("");
  //每只股票在基金净值中占比的数列
  const [ratio, setRatio] = useState("");
  //昨日收盘净值
  const [yes_Net, setYes_Net] = useState("");
  //昨日和今日的市值
  const [yes_Total, setYes_Total] = useState(0);
  const [today_Total, setToday_Total] = useState(0);
  //生成股票表格需要的数据（占比部分除外， 有单独的接口推送）
  const [rmb_today, setRmb_today] = useState(0);
  const [rmb_yes, setRmb_yes] = useState(0);
  const [yes_xRate, SetYes_xRate] = useState("");
  const [today_xRate, SetToday_xRate] = useState("");

  const [data, setData] = useState([
    {
      key: 1,
      stockName: "贵州茅台",
      stockCode: "600519",
      sharesHolding: 300,
      close: 2015,
      priceChange: -12,
      precentageChange: "1%",
      capital: 20000,
      proportion: "2%",
      marketValue: 0,
      predictMarketValue: 0,
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
    axios
      .get(value_url)
      .then((res) => setYes_Total(res.data))
      .catch((err) => console.log(err));
  }, []);
  const SearchAllStocks = () => {
    axios
      .get(uri)
      .then((res) => {
        let originalArr = res.data.split(";\n").slice(0, -1);
        let stockArr = originalArr.map((x, index) => {
          let strArr = x.split("~");
          return {
            key: (index + 1) * 1,
            stockName: strArr[1],
            stockCode: strArr[2],
            sharesHolding: ratio[index].sharesHolding,
            close: strArr[3],
            priceChange: strArr[4],
            precentageChange: `${strArr[5]}%`,
            capital: strArr[9],
            proportion: ratio[index].proportion,
            marketValue: ratio[index].marketValue,
            predictMarketValue:
              "$" +
              (
                ((1 + strArr[5].split("%")[0] / 100) *
                  ratio[index].marketValue.match(/[0-9]/g).join("")) /
                100
              ).toFixed(2),
          };
        });
        setData(stockArr);
        // console.log(stockArr);
      })
      .catch((error) => console.log(error));
  };
  const calTodayTotalMarketValue = () => {
    if (data && ratio) {
      let sum = 312303; //剩余现金等价物
      let rmb_sum = sum * 4.75; //人民币余额
      let yes_rmb_sum = sum * 4.75;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].predictMarketValue.match(/[0-9]/g).join("") / 100;
        rmb_sum +=
          data[i].close * data[i].sharesHolding.match(/[0-9]/g).join("");
        yes_rmb_sum +=
          (data[i].close - data[i].priceChange) *
          data[i].sharesHolding.match(/[0-9]/g).join("");
      }
      setToday_Total(sum.toFixed(2)); //今天澳币总市值
      setRmb_today(rmb_sum.toFixed(2)); //今天人民币总市值
      setRmb_yes(yes_rmb_sum.toFixed(2)); //昨天人民币总市值
    }
  };
  return (
    <div>
      <Row gutter={16} style={{ backgroundColor: "#eee" }}>
        <Col span={8} key="1">
          <Card
            title="昨日净值与市值"
            hoverable={true}
            style={{ width: "100%" }}
          >
            <Input
              onChange={(e) => setYes_Net(e.target.value)}
              value={yes_Net}
              type="number"
              placeholder="请输入昨日净值"
            />
            <Statistic
              title="Yesterday Market Value (AUD):"
              value={yes_Total}
            />
            <Statistic title="Yesterday Market Value (RMB):" value={rmb_yes} />
          </Card>
        </Col>
        <Col span={8} key="2">
          <Card
            title="CNY/AUD汇率中间价波动（%）"
            hoverable={true}
            style={{ width: "100%" }}
          >
            <Row>
              <Col>
                <Input
                  onChange={(e) => SetYes_xRate(e.target.value)}
                  value={yes_xRate}
                  type="number"
                  placeholder="请输入初始汇率"
                />
              </Col>
              <Col>
                <Input
                  onChange={(e) => SetToday_xRate(e.target.value)}
                  value={today_xRate}
                  type="number"
                  placeholder="请输入今日汇率"
                />
              </Col>
            </Row>
            <Statistic
              title="Today's Market value after exchangeRate:"
              value={
                today_Total !== 0 && yes_xRate !== "" && today_xRate !== ""
                  ? (rmb_today / today_xRate).toFixed(2)
                  : 0
              }
            />
            <Statistic
              title="Yesterday & Today Exchange Rate:"
              value={
                (rmb_yes / yes_Total).toFixed(4) +
                " / " +
                (rmb_today / today_Total).toFixed(4)
              }
            />
          </Card>
        </Col>
        <Col span={8} key="3">
          <Card title="今日净值预估" hoverable={true} style={{ width: "100%" }}>
            <Row>
              <Col style={{ marginRight: 10, textAlign: "center" }} key="1">
                <Button type="primary" onClick={calTodayTotalMarketValue}>
                  计算今日市值
                </Button>
                <Statistic
                  title="Today Market Value(AUD):"
                  value={today_Total}
                />
                <Statistic title="Today Market Value(RMB):" value={rmb_today} />
              </Col>
              <Col style={{ marginRight: 10, textAlign: "center" }} key="2">
                <Button type="primary">计算今日净值（包含汇率）</Button>
                <Statistic
                  title="Net Asset"
                  value={(
                    (rmb_today / today_xRate / yes_Total) *
                    yes_Net
                  ).toFixed(2)}
                />
              </Col>
            </Row>
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
      <Button type="primary" style={{ marginBottom: 30, marginLeft: 10 }}>
        Switch to CETF
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
