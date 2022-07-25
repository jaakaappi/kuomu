import React from "react";
import { Marker } from "react-map-gl";

const KuomuMarker = (props: {
  latitude: number;
  longitude: number;
  icon: any;
  freeCapacity: number;
  onClick: () => void;
}) => {
  const { latitude, longitude, freeCapacity, icon, onClick } = props;
  return (
    <Marker latitude={latitude} longitude={longitude}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "5px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          letterSpacing: "2px",
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

export default KuomuMarker;
