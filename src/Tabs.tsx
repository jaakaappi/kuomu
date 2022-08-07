import React from "react";
import { Link, useLocation } from "react-router-dom";

import loadingIcon from "./static/loading.png";

export const Tabs = (props: { loading: boolean; error: boolean }) => {
  const { loading, error } = props;

  const LoadingIconComponent = () => (
    <img
      id="loading"
      src={loadingIcon}
      width="16px"
      height="16px"
      style={{ verticalAlign: "text-top", marginRight: "5px" }}
    />
  );

  const Tab = (props: { path: string; text: string }) => {
    const { path, text } = props;
    const location = useLocation();

    let classNames = "tab";
    if (location.pathname === path) classNames += " selected";
    if (loading) classNames += " disabled";

    return (
      <div className={classNames}>
        {loading ? <LoadingIconComponent /> : null}
        {error ? "⚠️ " : ""}
        <Link to={path + location.search}>{text}</Link>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        borderBottom: "1px solid",
        borderColor: "lightgrey",
      }}
    >
      <Tab path={"/"} text={"Kartta"} />
      <Tab path={"/list"} text={"Lista"} />
    </div>
  );
};
