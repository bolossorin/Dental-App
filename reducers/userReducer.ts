import {
  ActionMap,
  IDentistBio,
  IDentistGallery,
  IDentistLocations,
  IDentistServices,
  IDentist_SpecialState,
  IUserGallery,
  UserLocation,
  UserServices,
} from "./types";

export enum UserTypes {
  RESET = "RESET_USER",
  LOGIN = "USER_LOGIN",
  LOGOUT = "USER_LOGOUT",
  SET_INFO = "USER_SET_INFO",
  SET_FULL_DATA = "SET_FULL_DATA",
  REMOVE_LOCATION = "REMOVE_LOCATION",
  ADD_LOCATION = "ADD_LOCATION",
  SET_LOCATIONS = "SET_LOCATIONS",
  SET_ALL_SERVICES = "SET_ALL_SERVICES",
  ADD_SERVICES = "ADD_SERVICES",
  REMOVE_SERVICE = "REMOVE_SERVICE",
  SET_AVATAR_URL = "SET_AVATAR_URL",
  SET_COVER_URL = "SET_COVER_URL",
  REMOVE_FROM_GALLERY = "REMOVE_FROM_GALLERY",
  ADD_TO_GALLERY = "ADD_TO_GALLERY",
  UPDATE_ITEM_GALLERY = "UPDATE_ITEM_GALLERY",
  SET_GALLERY = "SET_GALLERY",
}

// USER_DATA_LAKE
export type userPayload = {
  [UserTypes.RESET]: undefined;
  [UserTypes.LOGOUT]: undefined;
  [UserTypes.LOGIN]: {};
  [UserTypes.SET_INFO]: {
    title: string;
    username: string;
    qualifications: string;
    profileBio: string;
    email: string;
    website?: string;
    phone?: string;
  };
  [UserTypes.REMOVE_LOCATION]: {
    id: string;
  };
  [UserTypes.ADD_LOCATION]: {
    location: UserLocation;
  };
  [UserTypes.SET_LOCATIONS]: {
    locations: UserLocation[];
  };
  [UserTypes.REMOVE_FROM_GALLERY]: {
    key: string;
  };
  [UserTypes.ADD_TO_GALLERY]: {
    item: IUserGallery;
  };
  [UserTypes.UPDATE_ITEM_GALLERY]: {
    item: {
      key: string;
      altTagsAfter: string;
      altTagsBefore: string;
      service_id: string;
      service_name: string;
      titleAfter: string;
      titleBefore: string;
    };
  };
  [UserTypes.SET_GALLERY]: {
    gallery: IUserGallery[];
  };
  [UserTypes.SET_ALL_SERVICES]: {
    allowedServices: UserServices[];
  };
  [UserTypes.REMOVE_SERVICE]: {
    key: string;
  };
  [UserTypes.ADD_SERVICES]: {
    services: UserServices[];
  };
  [UserTypes.SET_AVATAR_URL]: {
    avatar_ul: string;
  };
  [UserTypes.SET_COVER_URL]: {
    cover_ul: string;
  };
  [UserTypes.SET_FULL_DATA]: TUserReducerState;
};

export type TUserReducerState = IDentistBio &
  IDentistLocations &
  IDentistServices &
  IDentist_SpecialState &
  IDentistGallery;

export type UserActions = ActionMap<userPayload>[keyof ActionMap<userPayload>];

export const UserInitialState: TUserReducerState = {
  gdcNumber: 0,
  isLogged: false,
  title: "Dr",
  username: "John Doe",
  email: "",
  qualifications: "",
  profileBio: "",
  accountType: "free",
  avatar_url: "",
  cover_url: "",
  locations: null,
  gallery: null,
  phone: null,
  services: null,
  website: null,
  allowedServices: null,
};

export const userReducer = (
  state: TUserReducerState,
  action: UserActions
): TUserReducerState => {
  switch (action.type) {
    case UserTypes.RESET:
      return {...state, email: ""};
    case UserTypes.LOGIN:
      return {...state, ...action.payload, isLogged: true};
    case UserTypes.LOGOUT:
      return {...UserInitialState};
    case UserTypes.SET_INFO:
      return {...state, ...action.payload};
    case UserTypes.SET_AVATAR_URL:
      return {...state, avatar_url: action.payload.avatar_ul};
    case UserTypes.SET_COVER_URL:
      return {...state, cover_url: action.payload.cover_ul};
    case UserTypes.SET_FULL_DATA:
      return {...state, ...action.payload};
    case UserTypes.SET_LOCATIONS:
      return {...state, locations: action.payload.locations};
    case UserTypes.REMOVE_LOCATION:
      const afterRemovingLocation =
        state.locations?.filter((item) => item.key !== action.payload.id) ||
        null;
      return {...state, locations: afterRemovingLocation};
    case UserTypes.REMOVE_SERVICE:
      const afterRemovingService = state.services?.filter((item) => item.key !== action.payload.key) ||
        null;
      return {...state, services: afterRemovingService};
    case UserTypes.ADD_LOCATION:
      const afterAddingLocation =
        state.locations?.concat(action.payload.location) || null;
      return {...state, locations: afterAddingLocation};
    case UserTypes.ADD_SERVICES:
      const afterAddingServices = state.services?.concat(action.payload.services) || action.payload.services;
      return {...state, services: afterAddingServices};
    case UserTypes.SET_ALL_SERVICES:
      return {...state, allowedServices: action.payload.allowedServices};
    case UserTypes.SET_GALLERY:
      return {...state, gallery: action.payload.gallery};
    case UserTypes.ADD_TO_GALLERY:
      const afterAddingGallery =
        state.gallery?.concat(action.payload.item) || null;
      return {...state, gallery: afterAddingGallery};
    case UserTypes.REMOVE_FROM_GALLERY:
      const afterRemovingPhoto =
        state.gallery?.filter((item) => item.key !== action.payload.key) ||
        null;
      return {...state, gallery: afterRemovingPhoto};
    case UserTypes.UPDATE_ITEM_GALLERY:
      const {key, ...updated} = action.payload.item;
      const afterUpdateGallery =
        state.gallery?.map((item) => {
          let i = item;
          if (item.key === key) {
            i = {
              ...updated,
              key,
              email: item.email,
              extensionAfter: item.extensionAfter,
              extensionBefore: item.extensionBefore,
              imageAfterUrl: item.imageAfterUrl,
              imageBeforeUrl: item.imageBeforeUrl,
            };
          }
          return i;
        }) || null;
      return {...state, gallery: afterUpdateGallery};
    default:
      return state;
  }
};
