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
  ISubSettings,
  IAdminDetails,
  IPremiumInformation,
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
  GET_SUBSCRIBER_SETTINGS = "GET_SUBSCRIBER_SETTINGS",
  GET_SERVICES = "GET_SERVICES",
  DELETE_SERVICE = "DELETE_SERVICE",
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
  [UserTypes.REMOVE_LOCATION]: { id: string; };
  [UserTypes.ADD_LOCATION]: { location: UserLocation; };
  [UserTypes.SET_LOCATIONS]: { locations: UserLocation[]; };
  [UserTypes.REMOVE_FROM_GALLERY]: { key: string; };
  [UserTypes.ADD_TO_GALLERY]: { item: IUserGallery; };
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
  [UserTypes.SET_GALLERY]: { gallery: IUserGallery[]; };
  [UserTypes.SET_ALL_SERVICES]: { allowedServices: UserServices[]; };
  [UserTypes.REMOVE_SERVICE]: { key: string; };
  [UserTypes.ADD_SERVICES]: { services: UserServices[]; };
  [UserTypes.SET_AVATAR_URL]: { avatar_ul: string; };
  [UserTypes.SET_COVER_URL]: { cover_ul: string; };
  [UserTypes.SET_FULL_DATA]: TUserReducerState;
  [UserTypes.GET_SUBSCRIBER_SETTINGS]: ISubSettings;
  [UserTypes.GET_SERVICES]: UserServices[];
  [UserTypes.DELETE_SERVICE]: { id: string; };
};

export type TUserReducerState = IDentistBio &
  IDentistLocations &
  IDentistServices &
  IDentist_SpecialState &
  IDentistGallery &
  { adminDetails: IAdminDetails } &
  { premiumInformation: IPremiumInformation } &
  { subscriberSettings: ISubSettings };

export type UserActions = ActionMap<userPayload>[keyof ActionMap<userPayload>];

export const UserInitialState: TUserReducerState = {
  gdcNumber: 0,
  isLogged: false,
  premiumInformation: {
    features: ['Verification Checkmark'],
    price: 0,
    setting_code: "",
    terms: "",
  },
  adminDetails: {
    username: 'John Doe',
    email: 'test@test.test',
    avatar_url: '',
  },
  subscriberSettings: {
    freeHasPhoneNumber: false,
    freeHasWebsite: false,
    freeIsVerified: false,
    freeMaxLocations: 1,
    freeMaxServices: 1,
    paidHasPhoneNumber: false,
    paidHasWebsite: false,
    paidIsVerified: false,
    paidMaxLocations: 1,
    paidMaxServices: 1,
    setting_code: "",
  },
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
    case UserTypes.GET_SUBSCRIBER_SETTINGS:
      return {...state, subscriberSettings: {...action.payload}};
    case UserTypes.GET_SERVICES:
      return {...state, services: action.payload};
    case UserTypes.DELETE_SERVICE:
      const filterServices = state.services.filter((item) => item.service_id !== action.payload.id);
      return {...state, services: filterServices};
    default:
      return state;
  }
};
