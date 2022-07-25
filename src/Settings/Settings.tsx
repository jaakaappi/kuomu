import React, { useState } from "react";

import DateTimeSelectors from "./DateTimeSelectors";

const Settings = () => {
  return (
    <div style={{ zIndex: 1, position: "relative" }}>
      <DateTimeSelectors />
    </div>
  );
};

export default Settings;
