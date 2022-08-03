import { DateTime } from "luxon";
import { number } from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { distance } from "@turf/turf"

import { PuuiloItem, PuuiloStore } from "../types";
import { calculateFreeTrailersForDateTime, formatPuuiloUrlString } from "../utils";

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
    }).filter((store) => store.freeTrailers.length > 0);
    return storesWithFreeSlots;
  }, sortedStores);

  return (
    <>
      <h2>Sinua lähimmät vapaat perävaunut</h2>
      {sortedFreeTrailers.length > 0 ? sortedFreeTrailers.map((store, storeIndex) => (
        <div key={store.store.store.id + storeIndex} style={storeIndex == 0 ? {} : {
          borderStyle: "solid",
          padding: "5px",
          borderWidth: "1px 0 0 0"
        }}>
          <p>Paina vaunun nimeä siirtyäksesi kaupan varaussivulle.</p>
          {
            store.freeTrailers.map((slot, itemIndex) => {
              const item: PuuiloItem | undefined = store.store.store.items!.find((item) => item.id == slot.id);

              return item ? (
                <div key={slot.id + itemIndex} style={{ display: 'flex' }}>
                  <div style={{
                    alignSelf: 'center',
                    paddingRight: '10px',
                    width: '100px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <img src={item.images[0].sizes.original} height={64} />
                  </div>
                  <div>
                    <h3><a href={`${store.store.store.url}/${formatPuuiloUrlString(item.title)}`}>{item.title}</a></h3>
                    <p>kpl {store.store.store.title} - {store.store.distance?.toPrecision(3)} km</p>
                  </div>
                </div>) : (null);
            })}
        </div>
      )) : <p>Missään kaupassa ei ole vuokrattavia vaunuja valitulle päivälle :/</p>
      }
    </>
  );
};

export default List;
