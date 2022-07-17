import React, { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import DateTimeSelectors from "./DateTimeSelectors";

const Settings = () => {
  return (
    <div style={{ zIndex: 1, position: "relative" }}>
      <DateTimeSelectors />
    </div>
  );
};

export default Settings;
