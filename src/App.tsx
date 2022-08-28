import React, { useMemo, useState } from "react";
import List from "./List/List";

import KuomuMap from "./Map/KuomuMap";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

import { DateTime } from "luxon";
import { Route, Routes } from "react-router-dom";
import { Tabs } from "./Tabs";
import { PuuiloStore } from "./types";
import distance from "@turf/distance";

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

  const calculateDistanceToPoint = (
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ) => {
    return distance(
      [point1.longitude, point1.latitude],
      [point2.longitude, point2.latitude]
    );
  };

  const sortedStores = useMemo<
    Array<{ distance: number | undefined; store: PuuiloStore }>
  >(() => {
    if (stores) {
      return coordinates.lat && coordinates.long
        ? stores
          .filter((store) => store.location)
          .map((store) => {
            const distance = calculateDistanceToPoint(
              { latitude: store.location![1], longitude: store.location![0] },
              { latitude: coordinates.lat, longitude: coordinates.long }
            );
            return {
              store: store,
              distance: distance,
            };
          })
          .sort((a, b) => a.distance - b.distance)
        : stores.map((store) => {
          return { store: store, distance: undefined };
        });
    } else return [];
  }, [stores, coordinates]);

  const setDate = (newDate: DateTime) => {
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
                  sortedPuuiloStores={sortedStores || []}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route
              path={"list"}
              element={
                <List
                  sortedPuuiloStores={sortedStores || []}
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
