export type PuuiloStore = {
  id: String;
  slotsPerHour: String;
  store: PuuiloStoreInfo;
  openHours: Array<{ from: String; to: String }>;
  title: String;
  address: String;
  postCode: Number;
  city: String;
  location?: [number, number] | undefined;
  reservations: PuuiloStoreReservations;
};

type PuuiloStoreInfo = {
  id: String;
  title: String;
  links: { href: String };
};

export type PuuiloStoreReservations = {
  date: String;
  days: Array<{
    date: String;
    hours: Array<{ hour: String; slots: Array<PuuiloReservationSlot> }>;
  }>;
};

type PuuiloReservationSlot = {
  date: Number;
  /**
   * Is the store open
   */
  isAvailable: Boolean;
  /**
   * Are there free trailers
   */
  hasCapacity: Boolean;
  /**
   * Array of available license plates
   */
  capacityUnits: Array<string>;
  price: Number;
};
