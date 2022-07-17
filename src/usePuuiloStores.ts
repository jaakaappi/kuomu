import { useEffect, useState } from "react";
import { PuuiloStore } from "./types";

const usePuuiloStores = () => {
  const [stores, setStores] = useState<Array<PuuiloStore> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const storeResponse = await fetch(
          "https://varaus-api.puuilo.fi/api/reservation/v1/offices?_limit=50",
          {
            headers: {
              Apikey:
                "R9yRG8huMG3vBKwczyeQxqhh5v8k0DQ2RQx4IiDDjf01Otm4WuIPux6H07jNN7Mz",
            },
          }
        );
        const stores = (await storeResponse.json()).data as Array<PuuiloStore>;
        const locationResponses = await Promise.all(
          stores.map((store) => {
            if (store.address.length > 0) {
              return fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                  store.address + " " + store.city + " " + store.postCode
                )}.json?country=fi&limit=1&types=address%2Cpoi&access_token=${
                  process.env.MAPBOX_API_TOKEN
                }`
              );
            } else return null;
          })
        );
        const locations = await Promise.all(
          locationResponses.map((response) => {
            return response?.json() || "";
          })
        );
        const storesWithLocations = stores.map((store, index) => {
          if (locations[index].features) {
            const newStoreWithLocation = {
              ...store,
              location: locations[index].features[0].center,
            };
            return newStoreWithLocation;
          } else {
            return store;
          }
        });
        setStores(storesWithLocations);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stores, loading, error };
};

export default usePuuiloStores;
