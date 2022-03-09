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
  services: Null_Or_<UserServices[]>;
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
  accountType: "free" | "premium";
  avatar_url: Null_Or_<string>;
  cover_url: Null_Or_<string>;
  allowedServices: Null_Or_<UserServices[]>;
};
