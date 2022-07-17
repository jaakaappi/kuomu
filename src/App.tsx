import React, { useEffect, useState } from "react";

import Map from "./Map";
import Settings from "./Settings/Settings";
import usePuuiloStores from "./usePuuiloStores";

const App = () => {
  const { stores, loading, error } = usePuuiloStores();

  return (
    <>
      <Settings />
      <Map puuiloStores={stores || []} />
    </>
  );
};

export default App;
