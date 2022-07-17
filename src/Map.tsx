import React, { useEffect, useRef, useState } from "react";
import { usePosition } from "use-position";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PuuiloStore } from "./types";

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
          new mapboxgl.Marker().setLngLat(store.location).addTo(map.current!);
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
