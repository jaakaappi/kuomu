import { DateTime } from "luxon";
import { PuuiloStore } from "./types";

export const calculateFreeTrailersForDateTime = (
  store: PuuiloStore,
  dateTime: DateTime
) => {
  if (store.items) {
    return store.items.reduce((previousSum, currentItem) => {
      const allCapacityUnits = currentItem.capacityUnits.flat();

      const availableHourSlots = currentItem.reservations.days[
        dateTime.weekday - 1
      ].hours.filter((hour) => hour.hour >= dateTime.hour.toString());

      const freeCapacityUnits = currentItem.reservations
        ? Array.from(
            new Set(
              availableHourSlots.flatMap((hourSlot) => {
                const slotCapacityUnits = hourSlot.slots[0].capacityUnits;
                // Puuilo API returns units that are already reserved
                // Units not listed are available
                const freeSlotCapacityUnits = allCapacityUnits.filter(
                  (unit) => !slotCapacityUnits.includes(unit)
                );
                return freeSlotCapacityUnits;
              })
            )
          )
        : [];
      return previousSum + freeCapacityUnits.length;
    }, 0);
  } else return 0;
};
