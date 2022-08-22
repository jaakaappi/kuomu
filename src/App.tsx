import React, { useEffect, useState } from "react";
import List from "./List/List";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

import { DateTime } from "luxon";
import { Route, Routes } from "react-router-dom";
import { Tabs } from "./Tabs";

export const DateContext = React.createContext({
  date: DateTime.local(),
  setDate: (newDate: DateTime) => { },
});

export const LocationContext = React.createContext({
  coordinates: {
    long: 24.945831,
    lat: 60.192059,
  },
  setCoordinates: (newCoordinates: { long: number; lat: number }) => { },
});

const App = () => {
  const { stores, loading, error } = usePuuiloStores();
  const [date, changeDate] = useState(DateTime.local());
  const [coordinates, setCoordinates] = useState({
    long: 24.945831,
    lat: 60.192059,
  });

  const setDate = (newDate: DateTime) => {
    console.log("setDate");
    changeDate(newDate);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DateContext.Provider value={{ date, setDate }}>
        <LocationContext.Provider value={{ coordinates, setCoordinates }}>
          <Settings />
          <Tabs loading={loading} error={error} />
          <Routes>
            <Route
              path={"/"}
              element={
                <KuomuMap
                  puuiloStores={stores || []}
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
                  latitude={coordinates.lat}
                  longitude={coordinates.long}
                  loading={loading}
                  error={error}
                />
              }
            />
          </Routes>
        </LocationContext.Provider>
      </DateContext.Provider>
    </div>
  );
};

export default App;
