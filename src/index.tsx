import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import "./static/app.css";

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
