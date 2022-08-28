import React, { useContext, useMemo } from "react";

import { PuuiloItem, PuuiloStore } from "../types";
import {
  calculateFreeTrailersForDateTime,
  formatPuuiloUrlString,
} from "../utils";
import { DateContext } from "../App";

const List = (props: {
  sortedPuuiloStores: Array<{
    distance: number | undefined;
    store: PuuiloStore;
  }>;
  latitude: number | undefined;
  longitude: number | undefined;
  loading: boolean;
  error: boolean;
}) => {
  const { sortedPuuiloStores, latitude, longitude, loading, error } = props;

  const { date } = useContext(DateContext);

  const sortedFreeTrailers = useMemo(() => {
    const storesWithFreeSlots = sortedPuuiloStores
      .map((store) => {
        const storeFreeTrailersToday = calculateFreeTrailersForDateTime(
          store.store,
          date
        );
        return { store: store, freeTrailers: storeFreeTrailersToday };
      })
      .filter((store) => store.freeTrailers.length > 0);
    return storesWithFreeSlots;
  }, [sortedPuuiloStores, date]);

  const LoadingText = () => (
    <div style={{ padding: "5px" }}>
      <p>Kauppojen tietoja ladataan vielä.</p>
    </div>
  );
  const ErrorText = () => (
    <div style={{ padding: "5px" }}>
      <p>
        Tietojen latauksessa tapahtui virhe :( lataa sivu hetken päästä
        uudestaan.
      </p>
    </div>
  );

  if (loading) {
    return <LoadingText />;
  } else if (error) {
    return <ErrorText />;
  } else {
    return (
      <div style={{ padding: "5px" }}>
        <h2>Sinua lähimmät vapaat perävaunut</h2>
        <p>Paina vaunun nimeä siirtyäksesi kaupan varaussivulle.</p>
        {sortedFreeTrailers.length > 0 ? (
          sortedFreeTrailers.map((store, storeIndex) => (
            <div
              key={store.store.store.id + storeIndex}
              style={
                storeIndex == 0
                  ? {}
                  : {
                      borderStyle: "solid",
                      padding: "5px",
                      borderWidth: "1px 0 0 0",
                    }
              }
            >
              {store.freeTrailers.map((slot, itemIndex) => {
                const item: PuuiloItem | undefined =
                  store.store.store.items!.find((item) => item.id == slot.id);

                return item ? (
                  <div key={slot.id + itemIndex} style={{ display: "flex" }}>
                    <div
                      style={{
                        alignSelf: "center",
                        paddingRight: "10px",
                        width: "115px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img src={item.images[0].sizes.original} height={64} />
                    </div>
                    <div>
                      <h3>
                        <a
                          href={`${
                            store.store.store.url
                          }/${formatPuuiloUrlString(item.title)}`}
                        >
                          {item.title}
                        </a>
                      </h3>
                      <p>
                        {store.store.store.title} -{" "}
                        {store.store.distance?.toPrecision(3)} km
                      </p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ))
        ) : (
          <p>
            Missään kaupassa ei ole vuokrattavia vaunuja valitulle päivälle :/
          </p>
        )}
      </div>
    );
  }
};

export default List;
