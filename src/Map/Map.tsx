import React, { useEffect, useRef, useState } from "react";
import { usePosition } from "use-position";
import mapboxgl from "mapbox-gl";

import { PuuiloStore } from "../types";

import "mapbox-gl/dist/mapbox-gl.css";
import markerBackgroundImage from "../markerbackground.svg";
import puuiloIcon from "../puuilo.jpg";
import { DateTime } from "luxon";

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
    if (store.items && store.reservations) {
      return store.items.reduce((previousSum, currentItem, index) => {
        const allCapacityUnits = currentItem.capacityUnits.flat();

        console.log(store);
        const availableHourSlots = store.reservations![index].days[
          DateTime.local().weekday - 1
        ].hours.filter((hour) => hour.hour >= DateTime.local().hour.toString());

        const freeCapacityUnits = store.reservations
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
