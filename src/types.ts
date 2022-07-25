export type PuuiloStore = {
  id: string;
  slotsPerHour: string;
  store: PuuiloStoreInfo;
  openHours: Array<{ from: string; to: string }>;
  title: string;
  address: string;
  postCode: Number;
  city: string;
  location?: [number, number] | undefined;
  reservations: Array<PuuiloStoreReservations>;
  items?: Array<PuuiloItem>;
  url?: string;
};

type PuuiloStoreInfo = {
  id: string;
  title: string;
  links: { href: string };
};

export type PuuiloStoreReservations = {
  date: string;
  days: Array<{
    date: string;
    hours: Array<{ hour: string; slots: Array<PuuiloReservationSlot> }>;
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

export type PuuiloItem = {
  id: string;
  title: string;
  shopItemId: number;
  capacityUnits: Array<string>;
  state: string;
  // TODO refactor to contain reservations
};
