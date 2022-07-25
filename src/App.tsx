import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List/List";

import "react-tabs/style/react-tabs.css";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";
import { usePosition } from "use-position";

const App = () => {
  const { stores, loading, error } = usePuuiloStores();
  const { latitude, longitude, errorMessage } = usePosition(false);

  return (
    <Tabs>
      <TabList>
        <Tab>Kartta</Tab>
        <Tab>Lista</Tab>
      </TabList>

      <TabPanel>
        <Settings />
        <KuomuMap
          puuiloStores={stores || []}
          latitude={latitude}
          longitude={longitude}
        />
      </TabPanel>
      <TabPanel>
        <List
          puuiloStores={stores || []}
          latitude={latitude}
          longitude={longitude}
        />
      </TabPanel>
    </Tabs>
  );
};

export default App;
