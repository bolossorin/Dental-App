import {
  ActionMap,
  IAdminDetails,
  IPremiumInformation,
  ISubSettings,
  IService,
  IAdminMonthStats, IAdminYearStats,
} from "./types";

export enum AdminTypes {
  ADMIN_LOGIN = "ADMIN_LOGIN",
  ADMIN_LOGOUT = "ADMIN_LOGOUT",
  GET_SUBSCRIBER_SETTINGS = "GET_SUBSCRIBER_SETTINGS",
  GET_MONTHLY_STATS = "GET_MONTHLY_STATS",
  GET_SERVICES = "GET_SERVICES",
  DELETE_SERVICE = "DELETE_SERVICE",
  GET_YEAR_STATS = "GET_YEAR_STATS",
}

// ADMIN_DATA_LAKE
type AdminPayload = {
  [AdminTypes.ADMIN_LOGIN]: TAdminReducerState;
  [AdminTypes.ADMIN_LOGOUT]: undefined;
  [AdminTypes.GET_SUBSCRIBER_SETTINGS]: ISubSettings;
  [AdminTypes.GET_MONTHLY_STATS]: IAdminMonthStats;
  [AdminTypes.GET_YEAR_STATS]: IAdminYearStats;
  [AdminTypes.GET_SERVICES]: IService[];
  [AdminTypes.DELETE_SERVICE]: { id: string; };
};

export type TAdminReducerState =
  { isLoggedAdmin: boolean } &
  { isOpenLeftMenu: boolean } &
  { services: IService[] } &
  { adminDetails: IAdminDetails } &
  { premiumInformation: IPremiumInformation } &
  { subscriberSettings: ISubSettings } &
  { monthlyStats: IAdminMonthStats } &
  { yearStats: IAdminYearStats }

export type AdminActions =
  ActionMap<AdminPayload>[keyof ActionMap<AdminPayload>];

export const AdminInitialState: TAdminReducerState = {
  adminDetails: {
    username: '',
    email: '',
    avatarUrl: '',
  },
  services: [],
  premiumInformation: {
    features: [],
    price: 0,
    setting_code: "",
    terms: "",
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
  monthlyStats: {
    amountOfNewAccounts: 0,
    amountOfSubscriptions: 0,
    amountOfClosedAccounts: 0,
    amountOfClosedSubscriptions: 0,
    amountOfImages: 0,
  },
  yearStats: {
    amountOfNewAccounts: 0,
    amountOfSubscriptions: 0,
    amountOfClosedAccounts: 0,
    amountOfClosedSubscriptions: 0,
    amountOfImages: 0,
    graphicOfFreeAccounts: [],
    graphicOfSubscriptions: [],
  },
  isOpenLeftMenu: true,
  isLoggedAdmin: false,
};

export const adminReducer = (state: TAdminReducerState, action: AdminActions): TAdminReducerState => {
  switch (action.type) {
    case AdminTypes.ADMIN_LOGIN:
      return {...state, ...action.payload};
    case AdminTypes.ADMIN_LOGOUT:
      return {...AdminInitialState};
    case AdminTypes.GET_SUBSCRIBER_SETTINGS:
      return {...state, subscriberSettings: {...action.payload}};
    case AdminTypes.GET_MONTHLY_STATS:
      return {...state, monthlyStats: {...action.payload}};
    case AdminTypes.GET_YEAR_STATS:
      return {...state, yearStats: {...action.payload}};
    case AdminTypes.GET_SERVICES:
      return {...state, services: action.payload};
    case AdminTypes.DELETE_SERVICE:
      const filterServices = state.services.filter((item) => item.id !== action.payload.id);
      return {...state, services: filterServices};
    default:
      return state;
  }
};
