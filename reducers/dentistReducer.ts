import {
  ActionMap,
  IDentistBio,
  IDentistGallery,
  IDentistLocations,
  IServices,
  IDentist_SpecialState,
  IUserGallery,
  UserLocation,
  IService,
} from "./types";

export enum DentistTypes {
  RESET = "RESET_DENTIST",
  LOGIN = "DENTIST_LOGIN",
  LOGOUT = "DENTIST_LOGOUT",
  SET_INFO = "DENTIST_SET_INFO",
  SET_FULL_DATA = "SET_FULL_DATA",
  REMOVE_LOCATION = "REMOVE_LOCATION",
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

// DENTIST_DATA_LAKE
export type dentistPayload = {
  [DentistTypes.RESET]: undefined;
  [DentistTypes.LOGOUT]: undefined;
  [DentistTypes.LOGIN]: {};
  [DentistTypes.SET_INFO]: {
    title: string;
    username: string;
    qualifications: string;
    profileBio: string;
    email: string;
    website?: string;
    phone?: string;
  };
  [DentistTypes.REMOVE_LOCATION]: { id: string; };
  [DentistTypes.SET_LOCATIONS]: { locations: UserLocation[]; };
  [DentistTypes.REMOVE_FROM_GALLERY]: { key: string; };
  [DentistTypes.ADD_TO_GALLERY]: { item: IUserGallery; };
  [DentistTypes.UPDATE_ITEM_GALLERY]: {
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
  [DentistTypes.SET_GALLERY]: { gallery: IUserGallery[]; };
  [DentistTypes.SET_ALL_SERVICES]: { allowedServices: IService[]; };
  [DentistTypes.REMOVE_SERVICE]: { key: string; };
  [DentistTypes.ADD_SERVICES]: { services: IService[]; };
  [DentistTypes.SET_AVATAR_URL]:  string;
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
  gdcNumber: 0,
  isLogged: false,
  title: "",
  username: "",
  email: "",
  qualifications: "",
  profileBio: "",
  accountType: "free",
  avatar_url: "",
  cover_url: "",
  locations: null,
  gallery: null,
  phone: null,
  services: [
    {
      key: '1',
      service_name: 'Teeth Whitening',
      service_id: 'Teeth Whitening',
    },
    {
      key: '2',
      service_name: 'Veneers',
      service_id: 'Veneers',
    },
    {
      key: '3',
      service_name: 'Crowns',
      service_id: 'Crowns',
    },
  ],
  website: null,
  allowedServices: null,
};

export const dentistReducer = (
  state: TdentistReducerState,
  action: DentistActions
): TdentistReducerState => {
  switch (action.type) {
    case DentistTypes.RESET:
      return {...state, email: ""};
    case DentistTypes.LOGIN:
      return {...state, ...action.payload, isLogged: true};
    case DentistTypes.LOGOUT:
      return {...DentistInitialState};
    case DentistTypes.SET_INFO:
      return {...state, ...action.payload};
    case DentistTypes.SET_AVATAR_URL:
      return {...state, avatar_url: action.payload};
    case DentistTypes.SET_COVER_URL:
      return {...state, cover_url: action.payload.cover_ul};
    case DentistTypes.SET_FULL_DATA:
      return {...state, ...action.payload};
    case DentistTypes.SET_LOCATIONS:
      return {...state, locations: action.payload.locations};
    case DentistTypes.REMOVE_LOCATION:
      const afterRemovingLocation = state.locations?.filter((item) => item.key !== action.payload.id) || null;
      return {...state, locations: afterRemovingLocation};
    case DentistTypes.REMOVE_SERVICE:
      const afterRemovingService = state.services?.filter((item) => item.key !== action.payload.key) ||
        null;
      return {...state, services: afterRemovingService};
    case DentistTypes.ADD_SERVICES:
      const afterAddingServices = state.services?.concat(action.payload.services) || action.payload.services;
      return {...state, services: afterAddingServices};
    case DentistTypes.SET_ALL_SERVICES:
      return {...state, allowedServices: action.payload.allowedServices};
    case DentistTypes.SET_GALLERY:
      return {...state, gallery: action.payload.gallery};
    case DentistTypes.ADD_TO_GALLERY:
      const afterAddingGallery =
        state.gallery?.concat(action.payload.item) || null;
      return {...state, gallery: afterAddingGallery};
    case DentistTypes.REMOVE_FROM_GALLERY:
      const afterRemovingPhoto =
        state.gallery?.filter((item) => item.key !== action.payload.key) ||
        null;
      return {...state, gallery: afterRemovingPhoto};
    case DentistTypes.UPDATE_ITEM_GALLERY:
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
