import { DateTime } from "luxon";
import { PuuiloStore } from "./types";

export const calculateFreeTrailersForDateTime = (
  store: PuuiloStore,
  dateTime: DateTime
) => {
  if (store.items) {
    const freeTrailers = store.items.map((item) => {
      const allCapacityUnits = item.capacityUnits.flat();

      const availableHourSlots = item.reservations.days[
        dateTime.weekday - 1
      ].hours.filter((hour) => hour.hour >= dateTime.hour.toString());

      const hourSlotsWithFreeCapacity = availableHourSlots.map((hourSlot) => {
        const slotCapacityUnits = hourSlot.slots[0].capacityUnits;
        // Puuilo API returns units that are already reserved
        // Units not listed are available
        const freeSlotCapacityUnits = allCapacityUnits.filter(
          (unit) => !slotCapacityUnits.includes(unit)
        );
        return { hour: hourSlot.hour, freeCapacityUnits: freeSlotCapacityUnits };
      });

      return { id: item.id, hourSlotsWithFreeCapacity: hourSlotsWithFreeCapacity }
    }).flat();
    return freeTrailers;
  } else return [];
};
