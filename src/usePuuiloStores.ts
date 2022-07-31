import { useEffect, useState } from "react";
import { DateTime } from "luxon";

import { PuuiloItem, PuuiloStore, PuuiloStoreReservations } from "./types";
import { formatPuuiloUrlString } from "./utils";

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

        const storesWithStoreUrls = stores.map((store) => {
          const url = `https://varaus.puuilo.fi/${formatPuuiloUrlString(store.title)}`;
          return { ...store, url: url };
        });

        const locationResponses = await Promise.all(
          storesWithStoreUrls.map((store) => {
            if (store.address.length > 0) {
              return fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                  store.address + " " + store.city + " " + store.postCode
                )}.json?country=fi&limit=1&types=address%2Cpoi&access_token=${process.env.MAPBOX_API_TOKEN
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
        const storesWithLocations = storesWithStoreUrls.map((store, index) => {
          if (locations[index].features) {
            const newStoreWithLocation = {
              ...store,
              location: locations[index].features[0].center,
            } as PuuiloStore;
            return newStoreWithLocation;
          } else {
            return store;
          }
        });

        const itemResponses = await Promise.all(
          storesWithLocations.map((store) => {
            if (store.address.length > 0) {
              return fetch(
                `https://varaus-api.puuilo.fi/api/reservation/v1/offices/${store.id}/items`,
                {
                  headers: {
                    Apikey:
                      "R9yRG8huMG3vBKwczyeQxqhh5v8k0DQ2RQx4IiDDjf01Otm4WuIPux6H07jNN7Mz",
                  },
                }
              );
            } else return null;
          })
        );
        const items = (
          await Promise.all(
            itemResponses.map((response) => {
              return response?.json() || "";
            })
          )
        ).map((itemResponse) => {
          return itemResponse.data as Array<PuuiloItem>;
        });
        console.log("items");
        console.log(items);
        const storesWithItems = storesWithLocations.map((store, index) => {
          if (items[index]) {
            const newStoreWithItems = {
              ...store,
              items: items[index].filter(
                (item) =>
                  item.state === "active" && item.title.includes("kärry")
              ),
            } as PuuiloStore;
            return newStoreWithItems;
          } else {
            return store;
          }
        });
        console.log("storesWithItems");
        console.log(storesWithItems);

        const slotResponsesPerStore = await Promise.all(
          storesWithItems.map(async (store) => {
            return store.items
              ? await Promise.all(
                store.items.map((item: PuuiloItem) => {
                  return fetch(
                    `https://varaus-api.puuilo.fi/api/reservation/v1/calendar/2022/weeks/${DateTime.local().weekNumber
                    }?_officeId=${store.id}&_officeItemId=${item.id}`,
                    {
                      headers: {
                        Apikey:
                          "R9yRG8huMG3vBKwczyeQxqhh5v8k0DQ2RQx4IiDDjf01Otm4WuIPux6H07jNN7Mz",
                      },
                    }
                  );
                })
              )
              : [];
          })
        );

        const slotJsonsPerStore = await Promise.all(
          slotResponsesPerStore.map(
            async (responses) =>
              await Promise.all(
                responses.map((response) => response?.json() || "")
              )
          )
        );
        const storeSlots = await Promise.all(
          slotJsonsPerStore.map((jsons) =>
            jsons.map((json) => (json.data as PuuiloStoreReservations) || "")
          )
        );
        console.log("storeSlots");
        console.log(storeSlots);
        const storesWithSlots = storesWithItems.map((store, index) => {
          const slots = storeSlots[index];
          const items = store.items?.map((item, index) => {
            return { ...item, reservations: slots[index] };
          });
          const newStoreWithSlots = {
            ...store,
            items: items,
          };
          return newStoreWithSlots;
        });
        console.log("storesWithSlots");
        console.log(storesWithSlots);
        setStores(storesWithSlots);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stores, loading, error };
};

export default usePuuiloStores;
