import { center } from "@turf/turf";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LocationContext } from "../App";

const LocationSelector = () => {
  const { coordinates, setCoordinates } = useContext(LocationContext);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ text: string; center: [number, number] }>
  >([]);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    if (searchValue !== "") {
      console.log('searhing');
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

  const handleResultClicked = (result: {
    text: string;
    center: [number, number];
  }) => {
    console.log(result);
    setSearchValue(result.text);
    setCoordinates({ long: result.center[0], lat: result.center[1] });
    setHasFocus(false);
  };

  return (
    <div style={{ padding: "2px 5px 2px 5px" }}>
      Sijaintisi
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
      </div>
    </div>
  );
};

export default LocationSelector;