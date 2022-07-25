import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List/List";

import "react-tabs/style/react-tabs.css";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

const App = () => {
  const { stores, loading, error } = usePuuiloStores();

  return (
    <Tabs>
      <TabList>
        <Tab>Kartta</Tab>
        <Tab>Lista</Tab>
      </TabList>

      <TabPanel>
        <Settings />
        <KuomuMap puuiloStores={stores || []} />
      </TabPanel>
      <TabPanel>
        <List puuiloStores={stores || []} />
      </TabPanel>
    </Tabs>
  );
};

export default App;
