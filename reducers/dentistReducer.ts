import {
  ActionMap,
  IDentistBio,
  IDentistGallery,
  IDentistLocations,
  IServices,
  IDentist_SpecialState,
  IUserGallery,
  IService,
} from "./types";

export enum DentistTypes {
  RESET = "RESET_DENTIST",
  LOGIN = "DENTIST_LOGIN",
  LOGOUT = "DENTIST_LOGOUT",
  SET_INFO = "DENTIST_SET_INFO",
  SET_FULL_DATA = "SET_FULL_DATA",
  REMOVE_LOCATION = "REMOVE_LOCATION",
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

// DENTIST_DATA_LAKE
export type dentistPayload = {
  [DentistTypes.RESET]: undefined;
  [DentistTypes.LOGOUT]: undefined;
  [DentistTypes.LOGIN]: {};
  [DentistTypes.SET_INFO]: {
    title: string;
    dentist_name: string;
    qualifications: string;
    bio: string;
    email: string;
    website?: string;
    phone?: string;
  };
  [DentistTypes.REMOVE_LOCATION]: { id: string; };
  [DentistTypes.REMOVE_FROM_GALLERY]: string;
  [DentistTypes.ADD_TO_GALLERY]: { item: IUserGallery; };
  [DentistTypes.UPDATE_ITEM_GALLERY]: {
    item: {
      key: string;
      altTagsAfter: string;
      altTagsBefore: string;
      id: string;
      service_name: string;
      titleAfter: string;
      titleBefore: string;
    };
  };
  [DentistTypes.SET_GALLERY]: { gallery: IUserGallery[]; };
  [DentistTypes.SET_ALL_SERVICES]: IService[];
  [DentistTypes.REMOVE_SERVICE]: { key: string; };
  [DentistTypes.ADD_SERVICES]: { services: IService[]; };
  [DentistTypes.SET_AVATAR_URL]: string;
  [DentistTypes.SET_COVER_URL]: { cover_ul: string; };
  [DentistTypes.SET_FULL_DATA]: TdentistReducerState;
};

export type TdentistReducerState =
  { access_token: string } &
  IDentistBio &
  IDentistLocations &
  IServices &
  IDentist_SpecialState &
  IDentistGallery

export type DentistActions = ActionMap<dentistPayload>[keyof ActionMap<dentistPayload>];

export const DentistInitialState: TdentistReducerState = {
  access_token: '',
  gdc: 0,
  title: "",
  dentist_name: "",
  email: "",
  qualifications: "",
  bio: "",
  subscription_plan: "",
  subscription_end_date: null,
  avatarUrl: "",
  cover_url: "",
  locations: null,
  gallery: [],
  phone: null,
  services: [],
  website: null,
};

export const dentistReducer = (
  state: TdentistReducerState,
  action: DentistActions
): TdentistReducerState => {
  switch (action.type) {
    case DentistTypes.RESET:
      return {...state, email: ""};
    case DentistTypes.LOGIN:
      return {...state, ...action.payload};
    case DentistTypes.LOGOUT:
      return {...DentistInitialState};
    case DentistTypes.SET_INFO:
      return {...state, ...action.payload};
    case DentistTypes.SET_AVATAR_URL:
      return {...state, avatarUrl: action.payload};
    case DentistTypes.SET_COVER_URL:
      return {...state, cover_url: action.payload.cover_ul};
    case DentistTypes.SET_FULL_DATA:
      return {...state, ...action.payload};
    case DentistTypes.REMOVE_LOCATION:
      const afterRemovingLocation = state.locations?.filter((item) => item.key !== action.payload.id) || null;
      return {...state, locations: afterRemovingLocation};
    case DentistTypes.REMOVE_SERVICE:
      const afterRemovingService = state.services?.filter((item) => item.id !== action.payload.key) ||
        null;
      return {...state, services: afterRemovingService};
    case DentistTypes.ADD_SERVICES:
      const afterAddingServices = state.services?.concat(action.payload.services) || action.payload.services;
      return {...state, services: afterAddingServices};
    case DentistTypes.SET_GALLERY:
      return {...state, gallery: action.payload.gallery};
    case DentistTypes.ADD_TO_GALLERY:
      return {...state, gallery: [action.payload.item, ...state.gallery!]};
    case DentistTypes.REMOVE_FROM_GALLERY:
      const afterRemovingPhoto = state.gallery.filter((item) => item.id !== action.payload);
      return {...state, gallery: afterRemovingPhoto};
    case DentistTypes.UPDATE_ITEM_GALLERY:
      const {key, ...updated} = action.payload.item;
      const afterUpdateGallery =
        state.gallery?.map((item) => {
          let i = item;
          if (item.id === key) {
            i = {
              ...updated,
              key,
              email: item.email,
              imageAfterUrl: item.after.url,
              imageBeforeUrl: item.after.url,
            };
          }
          return i;
        }) || null;
      return {...state, gallery: afterUpdateGallery};
    default:
      return state;
  }
};
