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
  dentist_name: Null_Or_<string>;
  email: Null_Or_<string>;
  gdc: Null_Or_<number>;
  qualifications: Null_Or_<string>;
  bio: Null_Or_<string>;
  website: Null_Or_<string>;
  phone: Null_Or_<string>;
};

export type IServices = {
  services: IService[];
};

export interface IGraphicData {
  period: number;
  count: number;
}

export type UserLocation = {
  email: string;
  key: string;
  location: string;
  lat: number;
  lng: number;
};
export type IService = {
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
  avatarUrl: Null_Or_<string>;
  cover_url: Null_Or_<string>;
  allowedServices: Null_Or_<IService[]>;
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
  avatarUrl: string;
}

export interface IPremiumInformation {
  terms: string;
  setting_code: string | "premium_settings";
  features: string[];
  price: number;
}


export interface IAdminUser {
  website: string | null;
  subscription_id: string | null;
  gdc_number: string;
  bio: string | null;
  email: string;
  post_code: string;
  accountType: string;
  qualifications: string | null;
  username: string;
  exp: string | null;
  phone: string | null;
  auth_time: string | null;
  title: string | null;
  created_at: Date;
  isSuspended?: boolean;
}

export interface IAdminMonthStats {
  amountOfNewAccounts: number;
  amountOfSubscriptions: number;
  amountOfClosedAccounts: number;
  amountOfClosedSubscriptions: number;
  amountOfImages: number;
}

export interface IAdminYearStats {
  amountOfNewAccounts: number;
  amountOfSubscriptions: number;
  amountOfClosedAccounts: number;
  amountOfClosedSubscriptions: number;
  amountOfImages: number;
  graphicOfFreeAccounts: IGraphicData[];
  graphicOfSubscriptions: IGraphicData[];
}
