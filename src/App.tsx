import React, { useContext, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List/List";
import { usePosition } from "use-position";

import "react-tabs/style/react-tabs.css";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

import loadingIcon from "./static/loading.png";
import { DateTime } from "luxon";

export const DateContext = React.createContext({ date: DateTime.local(), setDate: (date: DateTime) => { } });

const App = () => {
  const { stores, loading, error } = usePuuiloStores();
  const { latitude, longitude, errorMessage } = usePosition(false);

  const LoadingIconComponent = () => <img id="loading" src={loadingIcon} width="16px" height="16px" style={{ verticalAlign: "text-top" }} />

  const [date, changeDate] = useState(DateTime.local());

  const setDate = (newDate: DateTime) => {
    console.log("setDate")
    changeDate(newDate);
  }

  return (
    <div style={{ padding: "10px" }}>
      <DateContext.Provider value={{ date, setDate }}>
        <Settings />
        <Tabs>
          <TabList>
            <Tab>{loading ? < LoadingIconComponent /> : null}{error ? "⚠️" : ""} Kartta</Tab>
            <Tab disabled={loading || error}>{loading ? < LoadingIconComponent /> : null}{error ? "⚠️" : ""} Lista</Tab>
          </TabList>
          <TabPanel>
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
      </DateContext.Provider>
    </div>
  );
};

export default App;
