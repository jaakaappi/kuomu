import React, { useState } from "react";
import List from "./List/List";
import { usePosition } from "use-position";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

import { DateTime } from "luxon";
import { Route, Routes } from "react-router-dom";
import { Tabs } from "./Tabs";

export const DateContext = React.createContext({
  date: DateTime.local(),
  setDate: (newDate: DateTime) => {},
});

const App = () => {
  const { stores, loading, error } = usePuuiloStores();
  const { latitude, longitude, errorMessage } = usePosition(false);

  const [date, changeDate] = useState(DateTime.local());

  const setDate = (newDate: DateTime) => {
    console.log("setDate");
    changeDate(newDate);
  };

  return (
    <div style={{ padding: "10px" }}>
      <DateContext.Provider value={{ date, setDate }}>
        <Settings />
        <Tabs loading={loading} error={error} />
        <Routes>
          <Route
            path={"/"}
            element={
              <KuomuMap
                puuiloStores={stores || []}
                latitude={latitude}
                longitude={longitude}
                loading={loading}
                error={error}
              />
            }
          />
          <Route
            path={"list"}
            element={
              <List
                puuiloStores={stores || []}
                latitude={latitude}
                longitude={longitude}
                loading={loading}
                error={error}
              />
            }
          />
        </Routes>
      </DateContext.Provider>
    </div>
  );
};

export default App;
