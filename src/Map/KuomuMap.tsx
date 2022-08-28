import React, { useContext, useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl";
import { DateTime } from "luxon";
import bbox from "@turf/bbox";
import { multiPoint, Polygon } from "@turf/helpers";
import "mapbox-gl/dist/mapbox-gl.css";

import { PuuiloStore } from "../types";
import puuiloIcon from "../static/puuilo.jpg";
import KuomuMarker from "./KuomuMarker";
import { calculateFreeTrailersForDateTime } from "../utils";
import { DateContext, LocationContext } from "../App";

const mapboxAccessToken = process.env.MAPBOX_API_TOKEN || "";

const KuomuMap = (props: {
  sortedPuuiloStores: Array<{
    distance: number | undefined;
    store: PuuiloStore;
  }>;
  loading: boolean;
  error: boolean;
}) => {
  const { sortedPuuiloStores, loading, error } = props;

  const [markers, setMarkers] = useState<Array<JSX.Element>>([]);
  const { coordinates } = useContext(LocationContext);
  const dateContext = useContext(DateContext);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (mapRef && mapRef.current) {
      mapRef.current.getMap().touchZoomRotate.disableRotation();
    }
  }, [mapRef, mapRef.current]);

  const calculateTotalFreeCapacityUnits = (
    store: PuuiloStore,
    dateTime: DateTime
  ) => {
    const freeTrailersForDay = calculateFreeTrailersForDateTime(
      store,
      dateTime
    );
    const totalFreeTrailers = new Set(
      freeTrailersForDay.reduce(
        (storeFreeCapacityUnits: Array<string>, currentItem) => {
          return storeFreeCapacityUnits.concat(
            currentItem.hourSlotsWithFreeCapacity.reduce(
              (
                itemFreeCapacityUnits: Array<string>,
                currentSlot
              ): Array<string> =>
                itemFreeCapacityUnits.concat(currentSlot.freeCapacityUnits),
              []
            )
          );
        },
        []
      )
    ).size;
    return totalFreeTrailers;
  };

  useEffect(() => {
    const newMarkers =
      sortedPuuiloStores
        .filter(({ store }) => store.location)
        .map(({ store }) => {
          return (
            <KuomuMarker
              key={store.id}
              latitude={store.location![1]}
              longitude={store.location![0]}
              icon={puuiloIcon}
              freeCapacity={calculateTotalFreeCapacityUnits(
                store,
                dateContext.date
              )}
              onClick={() => window.open(store.url, "_blank")}
            />
          );
        }) || [];
    setMarkers(newMarkers);
  }, [sortedPuuiloStores, dateContext.date]);

  useEffect(() => {
    if (coordinates && sortedPuuiloStores.length > 0 && sortedPuuiloStores[0].store.location) {
      const [minLng, minLat, maxLng, maxLat] = bbox(
        multiPoint([
          [coordinates.long, coordinates.lat],
          sortedPuuiloStores[0].store.location!,
        ])
      );
      const bounds = mapRef.current?.cameraForBounds([
        [minLng, minLat],
        [maxLng, maxLat],
      ], { padding: window.innerWidth / 10 });
      mapRef.current?.jumpTo({ ...bounds });
    }
  }, [coordinates, sortedPuuiloStores]);

  const LoadingText = () => <p>Kauppojen tietoja ladataan vielä.</p>;
  const ErrorText = () => (
    <p>
      Tietojen latauksessa tapahtui virhe :( lataa sivu hetken päästä uudestaan.
    </p>
  );

  return (
    <div
      style={{
        padding: "5px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "5px" }}>
        {loading ? (
          <LoadingText />
        ) : error ? (
          <ErrorText />
        ) : (
          <p>
            Karttakuvakkeessa näkyy kaupan logo ja vapaiden kärryjen määrä
            valitulle päivälle.<br></br>Paina kuvaketta siirtyäksesi kaupan
            varaussivulle.
          </p>
        )}
      </div>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Map
          initialViewState={{ longitude: coordinates.long, latitude: coordinates.lat, zoom: 11 }}
          ref={mapRef}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={mapboxAccessToken}
          dragRotate={false}
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {markers}
        </Map>
      </div>
    </div>
  );
};

export default KuomuMap;
