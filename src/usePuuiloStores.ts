import { useEffect, useState } from "react";
import { DateTime } from "luxon";

import { PuuiloItem, PuuiloStore, PuuiloStoreReservations } from "./types";

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
          const url = `https://varaus.puuilo.fi/${store.title.toLowerCase().replace('ä', 'a').replace('ö', 'o').replace(',', '').split(' ').join('-')
            }`;
          console.log(store.title.toLocaleLowerCase());
          console.log(url);
          return { ...store, url: url };
        })

        const locationResponses = await Promise.all(
          storesWithStoreUrls.map((store) => {
            if (store.address.length > 0) {
              return fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                  store.address + " " + store.city + " " + store.postCode
                )
                }.json ? country = fi & limit=1 & types=address % 2Cpoi & access_token=${process.env.MAPBOX_API_TOKEN
                } `
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
            };
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
            };
            return newStoreWithItems;
          } else {
            return store;
          }
        });
        console.log("storesWithItems");
        console.log(storesWithItems);

        // const currentDate = new Date();
        // const oneJanuary = new Date(currentDate.getFullYear(), 0, 1);
        // const numberOfDays = Math.floor(
        //   (currentDate.getTime() - oneJanuary.getTime()) / (24 * 60 * 60 * 1000)
        // );
        // const muricanNumberOfDay = currentDate.getDay();
        // const correctNumberOfDay =
        //   muricanNumberOfDay + muricanNumberOfDay == 0 ? 6 : -1;
        // const weekNumber = Math.ceil((correctNumberOfDay + numberOfDays) / 7);

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
          const newStoreWithSlots = {
            ...store,
            reservations: storeSlots[index],
          };
          return newStoreWithSlots;
        });
        console.log("storesWithSlots");
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
