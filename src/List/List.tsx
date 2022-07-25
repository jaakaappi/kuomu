import { number } from "prop-types";
import React, { useMemo, useState } from "react";
import { PuuiloStore } from "../types";

const List = (props: {
  puuiloStores: Array<PuuiloStore>;
  latitude: number | undefined;
  longitude: number | undefined;
}) => {
  const { puuiloStores, latitude, longitude } = props;

  const calculateDistanceToPoint = (
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ) => {
    return Math.sqrt(
      Math.pow(point1.latitude - point2.latitude, 2) +
        Math.pow(point1.longitude - point2.longitude, 2)
    );
  };

  const sortedStores = useMemo<
    Array<{ distance: number | undefined; store: PuuiloStore }>
  >(() => {
    return latitude && longitude
      ? puuiloStores
          .filter((store) => store.location)
          .map((store) => {
            const distance = calculateDistanceToPoint(
              { latitude: store.location![1], longitude: store.location![0] },
              { latitude, longitude }
            );
            return {
              store: store,
              distance: distance,
            };
          })
          .sort((a, b) => a.distance - b.distance)
      : puuiloStores.map((store) => {
          return { store: store, distance: undefined };
        });
  }, [puuiloStores, latitude, longitude]);

  return (
    <>
      <h2>Sinua lähimmät vapaat perävaunut</h2>
      {sortedStores.map((store) => (
        <div key={store.store.id}>
          <p>{store.store.title}</p>
        </div>
      ))}
    </>
  );
};

export default List;
