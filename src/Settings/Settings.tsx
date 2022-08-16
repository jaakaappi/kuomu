import React from "react";

import DateTimeSelectors from "./DateTimeSelectors";
import LocationSelector from "./LocationSelector";

const Settings = () => {
  return (
    <div
      style={{
        zIndex: 1,
        position: "relative",
        padding: "5px",
        paddingBottom: "10px",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <DateTimeSelectors />
      <LocationSelector />
    </div>
  );
};

export default Settings;
