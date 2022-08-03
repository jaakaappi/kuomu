import React, { useEffect, useRef, useState } from "react";
import { usePosition } from "use-position";
import Map, { Marker } from "react-map-gl";
import { DateTime } from "luxon";

import { PuuiloStore } from "../types";

import "mapbox-gl/dist/mapbox-gl.css";
import puuiloIcon from "../static/puuilo.jpg";
import KuomuMarker from "./KuomuMarker";
import { calculateFreeTrailersForDateTime } from "../utils";

const mapboxAccessToken = process.env.MAPBOX_API_TOKEN || "";

const KuomuMap = (props: {
  puuiloStores: Array<PuuiloStore>;
  latitude: number | undefined;
  longitude: number | undefined;
}) => {
  const { puuiloStores, latitude, longitude } = props;
  const [markers, setMarkers] = useState<Array<JSX.Element>>([]);

  const [viewState, setViewState] = React.useState({
    longitude: 26.0673,
    latitude: 64.9147,
    zoom: 13,
  });

  const calculateTotalFreeCapacityUnits = (store: PuuiloStore, dateTime: DateTime) => {
    const freeTrailersToday = calculateFreeTrailersForDateTime(store, dateTime);
    const totalFreeTrailers = (new Set(freeTrailersToday.reduce((storeFreeCapacityUnits: Array<string>, currentItem) => {
      return storeFreeCapacityUnits.concat(currentItem.hourSlotsWithFreeCapacity.reduce((itemFreeCapacityUnits: Array<string>, currentSlot): Array<string> => itemFreeCapacityUnits.concat(currentSlot.freeCapacityUnits), []));
    }, []))).size;
    return totalFreeTrailers;
  }

  useEffect(() => {
    if (latitude && longitude) {
      console.log("Lat: " + latitude + " long: " + longitude);
      setViewState({ latitude: latitude, longitude: longitude, zoom: 11 });
    }
  }, [latitude, longitude]);

  useEffect(() => {
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
              freeCapacity={calculateTotalFreeCapacityUnits(store, DateTime.local())}
              onClick={() => window.open(store.url, '_blank')}
            />
          );
        }) || [];
    setMarkers(newMarkers);
  }, [puuiloStores]);

  return (
    <div>
      <p>Karttakuvakkeessa näkyy kaupan logo ja vapaiden kärryjen määrä valitulle päivälle.<br></br>Paina kuvaketta siirtyäksesi kaupan varaussivulle.</p>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxAccessToken}
        style={{ height: "75vh" }}
        dragRotate={false}
      >
        {markers}
      </Map>
    </div>
  );
};

export default KuomuMap;
