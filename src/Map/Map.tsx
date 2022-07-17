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
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const mapStoreMarker = () => {
    const el = document.createElement("div");
    const markerContainerStyle = {
      display: "flex",
      flexDirection: "row",
      padding: "5px",
      backgroundColor: "#fff",
      borderRadius: "5px",
      letterSpacing: "2px",
    };
    el.innerHTML = `
    <div style="display:flex;flex-direction:row;padding:5px;background-color:#fff;border-radius:5px;letter-spacing:2px;">
      <img src="${puuiloIcon}" width=32 height=32 />
      <p style="margin: 0px; padding: 5px; align-self: center;">
        5/6
      </p>
    </div>
    `;
    return el;
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
      map.current?.setZoom(13);
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
          new mapboxgl.Marker(mapStoreMarker())
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
        style={{ height: "500px" }}
      />
    </div>
  );
};

export default Map;
