import React, { useContext, useEffect, useState } from "react";
import { usePosition } from "use-position";

import { LocationContext } from "../App";
import gpsIcon from "../static/gps.png";
import loadingIcon from "../static/loading.png";

const LocationSelector = () => {
  const { coordinates, setCoordinates } = useContext(LocationContext);

  const [searchValue, setSearchValue] = useState("Hae");
  const [searchResults, setSearchResults] = useState<
    Array<{ text: string; center: [number, number] }>
  >([]);
  const [hasFocus, setHasFocus] = useState(false);
  const [positionLoading, setPositionLoading] = useState(false);

  useEffect(() => {
    getPosition();
  }, [])

  useEffect(() => {
    if (searchValue !== "") {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchValue
        )}.json?country=fi&limit=5&types=place&access_token=${process.env.MAPBOX_API_TOKEN
        }`
      )
        .then((response) => response.json())
        .catch((e) => {
          console.log(e);
          setSearchResults([]);
        })
        .then((value) => setSearchResults(value.features));
    }
  }, [searchValue]);

  const getPosition = () => {
    setPositionLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({ long: position.coords.longitude, lat: position.coords.latitude });
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?country=fi&limit=1&types=place&access_token=${process.env.MAPBOX_API_TOKEN
        }`
      )
        .then((response) => response.json())
        .catch((e) => {
          console.log(e);
        })
        .then((value) => {
          setSearchValue(value.features[0].text)
        });
      setPositionLoading(false);
    }, (e) => {
      console.log(e);
      setPositionLoading(false);
    });
  }

  const handleResultClicked = (result: {
    text: string;
    center: [number, number];
  }) => {
    setSearchValue(result.text);
    setCoordinates({ long: result.center[0], lat: result.center[1] });
    setHasFocus(false);
  };

  return (
    <div style={{ padding: "2px 5px 2px 5px" }}>
      Kaupunki
      <div style={{ margin: "2px 0 2px 0" }}>
        <input
          type={"text"}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.currentTarget.value);
          }}
          onClick={() => {
            if (!hasFocus) {
              setHasFocus(true);
              setSearchValue("");
              setSearchResults([]);
            }
          }}
          onBlur={(e) => { e.preventDefault(); setHasFocus(false); }}
        />
        {searchResults.length > 0 &&
          hasFocus && ( // https://reactjs.org/docs/events.html#focus-events
            <div
              style={{
                position: "absolute",
                backgroundColor: "white",
                border: "1px solid black",
                marginTop: "2px",
                width: "203px",
              }}
            >
              {searchResults.map((result) => (
                <div
                  className="hover"
                  style={{ padding: "2px" }}
                  onClick={() => handleResultClicked(result)}
                  onMouseDown={(event) => event.preventDefault()}
                  key={result.text}
                >
                  {result.text}
                </div>
              ))}
            </div>
          )}
        <button style={{ marginLeft: "10px" }} onClick={getPosition} ><img className={positionLoading ? "loading" : ""} src={positionLoading ? loadingIcon : gpsIcon} style={{ height: "1em", verticalAlign: "middle", margin: "0 2px 2px 0" }} />Käytä sijaintiasi</button>
      </div>
    </div>
  );
};

export default LocationSelector;
