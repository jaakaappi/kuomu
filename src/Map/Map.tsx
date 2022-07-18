import React, { useEffect, useRef, useState } from "react";
import { usePosition } from "use-position";
import mapboxgl from "mapbox-gl";

import { PuuiloStore } from "../types";

import "mapbox-gl/dist/mapbox-gl.css";
import markerBackgroundImage from "../markerbackground.svg";
import puuiloIcon from "../puuilo.jpg";

mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN || "";

const Map = (props: { puuiloStores: Array<PuuiloStore> }) => {
  const { puuiloStores } = props;
  const [position, setPosition] = useState({ lat: 64.9147, lng: 26.0673 });
  const { latitude, longitude, errorMessage } = usePosition(false);

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom, setZoom] = useState(9);

  const mapStoreMarker = (freeCapacity: number) => {
    const el = document.createElement("div");
    el.innerHTML = `
    <div style="display:flex;flex-direction:row;padding:5px;background-color:#fff;border-radius:5px;letter-spacing:2px;">
      <img src="${puuiloIcon}" width=32 height=32 />
      <p style="margin: 0px; padding: 5px; align-self: center;">
        ${freeCapacity}
      </p>
    </div>
    `;
    return el;
  };

  const calculateFreeTrailersToday = (store: PuuiloStore) => {
    console.log(store);
    const free = store.reservations?.days[
      new Date().getUTCDay() - 1
    ].hours.reduce<Array<String>>((previous, current) => {
      console.log(previous);
      console.log(current);
      current.slots[0].capacityUnits.forEach((unit) => {
        console.log(unit);
        if (!previous.includes(unit)) previous.push(unit);
      });
      return previous;
    }, []).length;
    console.log(free);
    return free;
  };

  useEffect(() => {
    if (
      typeof errorMessage !== undefined &&
      latitude &&
      longitude &&
      latitude != (position.lat || longitude != position.lng)
    ) {
      console.log("Lat: " + latitude + " long: " + longitude);
      const newPosition = { lat: latitude, lng: longitude };
      setPosition(newPosition);
      map.current?.setCenter(newPosition);
      map.current?.setZoom(9);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v11",
      center: position,
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    if (map) {
      puuiloStores.map((store) => {
        if (store.location) {
          new mapboxgl.Marker(mapStoreMarker(calculateFreeTrailersToday(store)))
            .setLngLat(store.location)
            .addTo(map.current!);
        }
      });
    }
  }, [puuiloStores, map]);

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "1000px" }}
      />
    </div>
  );
};

export default Map;
