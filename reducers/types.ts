export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key;
    }
    : {
      type: Key;
      payload: M[Key];
    };
};

export type Null_Or_<T> = T | null;
export type IDentistBio = {
  title: Null_Or_<string>;
  username: Null_Or_<string>;
  email: Null_Or_<string>;
  gdcNumber: Null_Or_<number>;
  qualifications: Null_Or_<string>;
  profileBio: Null_Or_<string>;
  website: Null_Or_<string>;
  phone: Null_Or_<string>;
};
export type IDentistServices = {
  services: UserServices[];
};
export type UserLocation = {
  email: string;
  key: string;
  location: string;
  lat: number;
  lng: number;
};
export type UserServices = {
  key: string;
  service_name: string;
  service_id: string;
};
export type IDentistLocations = {
  locations: Null_Or_<UserLocation[]>;
};
export type IUserGallery = {
  service_name: string;
  service_id: string;
  titleBefore: string;
  titleAfter: string;
  altTagsBefore: string;
  altTagsAfter: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
  key: string;
  email: string;
  extensionAfter: string;
  extensionBefore: string;
};
export type IDentistGallery = {
  gallery: Null_Or_<IUserGallery[]>;
};
export type IDentist_SpecialState = {
  isLogged: boolean;
  accountType: string;
  avatar_url: Null_Or_<string>;
  cover_url: Null_Or_<string>;
  allowedServices: Null_Or_<UserServices[]>;
};

export interface ISubSettings {
  freeHasPhoneNumber: boolean;
  freeHasWebsite: boolean;
  freeIsVerified: boolean;
  freeMaxLocations: number;
  freeMaxServices: number;
  paidHasPhoneNumber: boolean;
  paidHasWebsite: boolean;
  paidIsVerified: boolean;
  paidMaxLocations: number;
  paidMaxServices: number;
  setting_code: string;
}

export interface IAdminDetails {
  username: string;
  email: string;
  avatar_url: string;
}

export interface IPremiumInformation {
  terms: string;
  setting_code: string | "premium_settings";
  features: string[];
  price: number;
}
