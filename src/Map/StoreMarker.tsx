import React, { useState } from "react";
import { Marker } from "react-map-gl";

const StoreMarker = (props: {
  latitude: number;
  longitude: number;
  icon: any;
  freeCapacity: number;
  onClick: () => void;
}) => {
  const { latitude, longitude, freeCapacity, icon, onClick } = props;

  return (
    <Marker latitude={latitude} longitude={longitude} onClick={onClick}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "5px",
          backgroundColor: "#fff",
          borderRadius: "3px",
          letterSpacing: "2px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        }}
      >
        <img src={icon} width={32} height={32} />
        <p
          style={{
            margin: 0,
            padding: "5px",
            paddingLeft: "10px",
            alignSelf: "center",
          }}
        >
          {freeCapacity}
        </p>
      </div>
    </Marker>
  );
};

export default StoreMarker;
