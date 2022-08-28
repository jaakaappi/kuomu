import React from "react";
import { Marker } from "react-map-gl";

import pinIcon from "../static/pin.png";

const LocationMarker = (props: {
  latitude: number;
  longitude: number;
}) => {
  const { latitude, longitude } = props;

  return (
    <Marker latitude={latitude} longitude={longitude} >
      <img src={pinIcon} width={32} height={32} />
    </Marker>
  );
};

export default LocationMarker;
