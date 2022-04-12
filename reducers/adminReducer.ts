import {
  ActionMap,
  IPremiumInformation,
  ISubSettings,
  IService,
  IAdminMonthStats, IAdminYearStats,
} from "./types";

export enum AdminTypes {
  ADMIN_LOGIN = "ADMIN_LOGIN",
  ADMIN_LOGOUT = "ADMIN_LOGOUT",
  GET_SUBSCRIBER_SETTINGS = "GET_SUBSCRIBER_SETTINGS",
  SET_SUBSCRIBER_SETTINGS = "SET_SUBSCRIBER_SETTINGS",
  SET_ALL_SERVICES = "SET_ALL_SERVICES",
  GET_MONTHLY_STATS = "GET_MONTHLY_STATS",
  GET_SERVICES = "GET_SERVICES",
  ADD_SERVICE = "ADD_SERVICE",
  UPDATE_SERVICE = "UPDATE_SERVICE",
  DELETE_SERVICE = "DELETE_SERVICE",
  GET_YEAR_STATS = "GET_YEAR_STATS",
}

// ADMIN_DATA_LAKE
type AdminPayload = {
  [AdminTypes.ADMIN_LOGIN]: { email: string, access_token: string };
  [AdminTypes.ADMIN_LOGOUT]: undefined;
  [AdminTypes.GET_SUBSCRIBER_SETTINGS]: ISubSettings[];
  [AdminTypes.SET_SUBSCRIBER_SETTINGS]: ISubSettings;
  [AdminTypes.SET_ALL_SERVICES]: IService[];
  [AdminTypes.GET_MONTHLY_STATS]: IAdminMonthStats;
  [AdminTypes.GET_YEAR_STATS]: IAdminYearStats;
  [AdminTypes.GET_SERVICES]: IService[];
  [AdminTypes.ADD_SERVICE]: IService;
  [AdminTypes.UPDATE_SERVICE]: IService;
  [AdminTypes.DELETE_SERVICE]: { id: string; };
};

export type TAdminReducerState =
  { access_token_admin: string } &
  { isOpenLeftMenu: boolean } &
  { services: IService[] } &
  { emailAdmin: string } &
  { usernameAdmin: string } &
  { premiumInformation: IPremiumInformation } &
  { subscriberSettings: ISubSettings[] } &
  { monthlyStats: IAdminMonthStats } &
  { yearStats: IAdminYearStats }

export type AdminActions =
  ActionMap<AdminPayload>[keyof ActionMap<AdminPayload>];

export const AdminInitialState: TAdminReducerState = {
  access_token_admin: "",
  emailAdmin: "",
  usernameAdmin: "",
  services: [],
  premiumInformation: {
    features: [],
    price: 0,
    setting_code: "",
    terms: "",
  },
  subscriberSettings: [],
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
};

export const adminReducer = (state: TAdminReducerState, action: AdminActions): TAdminReducerState => {
  switch (action.type) {
    case AdminTypes.ADMIN_LOGIN:
      const payload = {emailAdmin: action.payload.email, access_token_admin: action.payload.access_token}
      return {...state, ...payload};
    case AdminTypes.ADMIN_LOGOUT:
      return {...AdminInitialState};
    case AdminTypes.GET_SUBSCRIBER_SETTINGS:
      return {...state, subscriberSettings: action.payload};
    case AdminTypes.SET_SUBSCRIBER_SETTINGS:
      const newSubscriberSettings = state.subscriberSettings.map(item => {
        if (item.subscription_type === action.payload.subscription_type) return action.payload;
        return item;
      });
      return {...state, subscriberSettings: newSubscriberSettings};
    case AdminTypes.SET_ALL_SERVICES:
      return {...state, services: action.payload};
    case AdminTypes.GET_MONTHLY_STATS:
      return {...state, monthlyStats: {...action.payload}};
    case AdminTypes.GET_YEAR_STATS:
      return {...state, yearStats: {...action.payload}};
    case AdminTypes.GET_SERVICES:
      return {...state, services: action.payload};
    case AdminTypes.ADD_SERVICE:
      return {...state, services: [action.payload, ...state.services]};
    case AdminTypes.UPDATE_SERVICE:
      const newServices = state.services.map(item => {
        if (item.id === action.payload.id) return action.payload;
        return item;
      });
      return {...state, services: newServices};
    case AdminTypes.DELETE_SERVICE:
      const filterServices = state.services.filter((item) => item.id !== action.payload.id);
      return {...state, services: filterServices};
    default:
      return state;
  }
};
