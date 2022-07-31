import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List/List";
import { usePosition } from "use-position";

import "react-tabs/style/react-tabs.css";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

import loadingIcon from "./static/loading.png";

const App = () => {
  const { stores, loading, error } = usePuuiloStores();
  const { latitude, longitude, errorMessage } = usePosition(false);

  const LoadingIconComponent = () => <img id="loading" src={loadingIcon} width="16px" height="16px" style={{ verticalAlign: "text-top" }} />

  return (
    <Tabs>
      <TabList>
        <Tab>{loading ? < LoadingIconComponent /> : null}{error ? "⚠️" : ""} Kartta</Tab>
        <Tab disabled={loading || error}>{loading ? < LoadingIconComponent /> : null}{error ? "⚠️" : ""} Lista</Tab>
      </TabList>

      <TabPanel>
        <Settings />
        <KuomuMap
          puuiloStores={stores || []}
          latitude={latitude}
          longitude={longitude}
        />
      </TabPanel>
      <TabPanel >
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
