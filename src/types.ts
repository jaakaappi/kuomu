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
};

type PuuiloStoreInfo = {
  id: String;
  title: String;
  links: { href: String };
};
