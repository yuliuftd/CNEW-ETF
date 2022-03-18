import "./App.css";
import React from "react";
import { Tabs } from "antd";
import Pantry from "./Container/Pantry/Pantry.jsx";
import Recipe from "./Container/Recipe/Recipe.jsx";
import StockTable from "./Container/StockTable/StockTable";
// import { load, save } from "./Redux/store";
// import { useStore } from "react-redux";
import "antd/dist/antd.min.css";

const { TabPane } = Tabs;

function App() {
  // const store = useStore();
  // useEffect(() => {
  //   const state = load();
  //   if (process.browser) {
  //     store.subscribe(() => {
  //       save(store.getState());
  //     });
  //   }
  // }, [store]);
  return (
    <Tabs defaultActiveKey="3" centered size="large">
      <TabPane tab="Pantry" key="1">
        <Pantry />
      </TabPane>
      <TabPane tab="Recipe" key="2">
        <Recipe />
      </TabPane>
      <TabPane tab="StockList" key="3">
        <StockTable />
      </TabPane>
    </Tabs>
  );
}

export default App;
