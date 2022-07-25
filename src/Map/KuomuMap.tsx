import React, { useEffect, useRef, useState } from "react";
import { usePosition } from "use-position";
import Map, { Marker } from "react-map-gl";
import { DateTime } from "luxon";

import { PuuiloStore } from "../types";

import "mapbox-gl/dist/mapbox-gl.css";
import puuiloIcon from "../puuilo.jpg";
import KuomuMarker from "./KuomuMarker";

const mapboxAccessToken = process.env.MAPBOX_API_TOKEN || "";

const KuomuMap = (props: { puuiloStores: Array<PuuiloStore> }) => {
  const { puuiloStores } = props;
  const { latitude, longitude, errorMessage } = usePosition(false);
  const [markers, setMarkers] = useState<Array<JSX.Element>>([]);

  const [viewState, setViewState] = React.useState({
    longitude: 26.0673,
    latitude: 64.9147,
    zoom: 13,
  });

  const calculateFreeTrailersToday = (store: PuuiloStore) => {
    if (store.items) {
      return store.items.reduce((previousSum, currentItem, index) => {
        const allCapacityUnits = currentItem.capacityUnits.flat();

        const availableHourSlots = currentItem.reservations.days[
          DateTime.local().weekday - 1
        ].hours.filter((hour) => hour.hour >= DateTime.local().hour.toString());

        const freeCapacityUnits = currentItem.reservations
          ? Array.from(
              new Set(
                availableHourSlots.flatMap((hourSlot) => {
                  const slotCapacityUnits = hourSlot.slots[0].capacityUnits;
                  // Puuilo API returns units that are already reserved
                  // Units not listed are available
                  const freeSlotCapacityUnits = allCapacityUnits.filter(
                    (unit) => !slotCapacityUnits.includes(unit)
                  );
                  return freeSlotCapacityUnits;
                })
              )
            )
          : [];
        return previousSum + freeCapacityUnits.length;
      }, 0);
    } else return 0;
  };

  useEffect(() => {
    if (typeof errorMessage !== undefined && latitude && longitude) {
      console.log("Lat: " + latitude + " long: " + longitude);
      setViewState({ latitude: latitude, longitude: longitude, zoom: 11 });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    console.log("asd");
    const newMarkers =
      puuiloStores
        .filter((store) => store.location)
        .map((store) => {
          return (
            <KuomuMarker
              key={store.id}
              latitude={store.location![1]}
              longitude={store.location![0]}
              icon={puuiloIcon}
              freeCapacity={calculateFreeTrailersToday(store)}
              onClick={() => {}}
            ></KuomuMarker>
          );
        }) || [];
    setMarkers(newMarkers);
  }, [puuiloStores]);

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxAccessToken}
      style={{ height: "85vh" }}
    >
      {markers}
    </Map>
  );
};

export default KuomuMap;
