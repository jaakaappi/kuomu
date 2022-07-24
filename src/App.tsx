import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import List from "./List/List";

import Map from "./Map/Map";
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
        <Map puuiloStores={stores || []} />
      </TabPanel>
      <TabPanel>
        <List puuiloStores={stores || []} />
      </TabPanel>
    </Tabs>
  );
};

export default App;
