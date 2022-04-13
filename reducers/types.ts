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
  id: string;
  location: string;
  address: string;
  location_name: string;
  post_code: string;
  lat: number;
  lng: number;
};
export type IService = {
  service_name: string;
  id: string;
};
export type IDentistLocations = {
  locations: Null_Or_<UserLocation[]>;
};

export type IImageGallery = {
  public_id: string,
  title: string,
  tag: string,
  url: string
}
export type IUserGallery = {
  id: string;
  email: string;
  before: IImageGallery;
  after: IImageGallery;
  dentist_service_id: string;
  service_name: string
};

export type IDentistGallery = {
  gallery: IUserGallery[];
};
export type IDentist_SpecialState = {
  subscription_plan: string;
  subscription_end_date: Null_Or_<number>;
  avatarUrl: Null_Or_<string>;
  watermarkUrl: Null_Or_<string>;
};

export interface ISubSettings {
  appearVerifiedAllowed: boolean,
  maxLocations: number,
  maxService: number,
  phoneAllowed: boolean,
  subscription_type: string,
  websiteAllowed: boolean
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
  gdc: string;
  bio: string | null;
  email: string;
  locations: { post_code: string };
  subscription_plan: string;
  qualifications: string | null;
  dentist_name: string;
  subscription_end_date: number | null;
  phone: string | null;
  logged_in_at: number;
  title: string | null;
  created_at: Date | null;
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
