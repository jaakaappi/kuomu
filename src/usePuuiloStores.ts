import { useEffect, useState } from "react";
import { PuuiloStore, PuuiloStoreReservations } from "./types";

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

        //TODO fetch items

        const currentDate = new Date();
        const oneJanuary = new Date(currentDate.getFullYear(), 0, 1);
        const numberOfDays = Math.floor(
          (currentDate.getTime() - oneJanuary.getTime()) / (24 * 60 * 60 * 1000)
        );
        const weekNumber = Math.ceil(
          (currentDate.getDay() + 1 + numberOfDays) / 7
        );
        const slotResponses = await Promise.all(
          storesWithLocations.map((store) => {
            return fetch(
              `https://varaus-api.puuilo.fi/api/reservation/v1/calendar/2022/weeks/${weekNumber}?_officeId=${store.id}&_officeItemId=Va71md0D`,
              {
                headers: {
                  Apikey:
                    "R9yRG8huMG3vBKwczyeQxqhh5v8k0DQ2RQx4IiDDjf01Otm4WuIPux6H07jNN7Mz",
                },
              }
            );
          })
        );
        const storeSlots: Array<{ data: PuuiloStoreReservations }> =
          await Promise.all(
            slotResponses.map((response) => {
              return response?.json() || "";
            })
          );
        const storesWithSlots = storesWithLocations.map((store, index) => {
          const newStoreWithSlots = {
            ...store,
            reservations: storeSlots[index].data,
          };
          return newStoreWithSlots;
        });
        console.log(storesWithSlots);
        setStores(storesWithSlots);
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
