import { DateTime } from "luxon";
import { number } from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { distance } from "@turf/turf"

import { PuuiloStore } from "../types";
import { calculateFreeTrailersForDateTime } from "../utils";

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
    return distance([point1.longitude, point1.latitude], [point2.longitude, point2.latitude]);
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

  const sortedFreeTrailers = useMemo(() => {
    const storesWithFreeSlots = sortedStores.map((store) => {
      const storeFreeTrailersToday = calculateFreeTrailersForDateTime(store.store, DateTime.local());
      return { store: store, freeTrailers: storeFreeTrailersToday };
    });
    console.log("storesWithFreeSlots");
    console.log(storesWithFreeSlots);
    return storesWithFreeSlots;
  }, sortedStores);

  return (
    <>
      <h2>Sinua lähimmät vapaat perävaunut</h2>
      {sortedFreeTrailers.map((store, storeIndex) => (
        <div key={store.store.store.id + storeIndex} style={storeIndex == 0 ? {} : {
          borderStyle: "solid",
          padding: "5px",
          borderWidth: "1px 0 0 0"
        }}>{
            store.freeTrailers.map((slot, itemIndex) => {
              const item = store.store.store.items!.find((item) => item.id == slot.id);

              return item ? (
                <div key={slot.id + itemIndex}>
                  <h3>{item.title}</h3>
                  <p>{store.store.store.title} - {store.store.distance?.toPrecision(3)} km</p>
                </div>) : (null);
            })}
        </div>
      ))
      }
    </>
  );
};

export default List;
