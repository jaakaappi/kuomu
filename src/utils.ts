import { DateTime } from "luxon";
import { string } from "prop-types";
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
      }).filter((slot) => slot.freeCapacityUnits.length > 0);

      return { id: item.id, hourSlotsWithFreeCapacity: hourSlotsWithFreeCapacity }
    }).flat().filter((trailer) => trailer.hourSlotsWithFreeCapacity.length > 0);
    return freeTrailers;
  } else return [];
};

export const formatPuuiloUrlString = (inputString: string) => inputString.replace(/[äÄ]/g, 'a').replace(/[öÖ]/g, 'o').replace(',', '').split(' ').join('-').toLowerCase()