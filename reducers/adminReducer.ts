import {
  ActionMap,
  IPremiumInformation,
  ISubSettings,
  IService,
  IAdminStatistics,
  IAdminUser,
  IAdminStatistic, Null_Or_,
} from "./types";

export enum AdminTypes {
  ADMIN_LOGIN = "ADMIN_LOGIN",
  ADMIN_LOGOUT = "ADMIN_LOGOUT",
  GET_SUBSCRIBER_SETTINGS = "GET_SUBSCRIBER_SETTINGS",
  SET_SUBSCRIBER_SETTINGS = "SET_SUBSCRIBER_SETTINGS",
  SET_ALL_SERVICES = "SET_ALL_SERVICES",
  GET_SERVICES = "GET_SERVICES",
  ADD_SERVICE = "ADD_SERVICE",
  UPDATE_SERVICE = "UPDATE_SERVICE",
  DELETE_SERVICE = "DELETE_SERVICE",
  GET_USER_STATISTICS = "GET_USER_STATISTICS",
  GET_ALL_USERS = "GET_ALL_USERS",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
}

// ADMIN_DATA_LAKE
type AdminPayload = {
  [AdminTypes.ADMIN_LOGIN]: { email: string, access_token: string };
  [AdminTypes.ADMIN_LOGOUT]: undefined;
  [AdminTypes.GET_SUBSCRIBER_SETTINGS]: ISubSettings[];
  [AdminTypes.SET_SUBSCRIBER_SETTINGS]: ISubSettings;
  [AdminTypes.SET_ALL_SERVICES]: IService[];
  [AdminTypes.GET_USER_STATISTICS]: IAdminStatistic[];
  [AdminTypes.GET_ALL_USERS]: IAdminUser[];
  [AdminTypes.UPDATE_USER]: IAdminUser;
  [AdminTypes.DELETE_USER]: string;
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
  { userStatistics: IAdminStatistics } &
  { users: Null_Or_<IAdminUser[]> }

export type AdminActions =
  ActionMap<AdminPayload>[keyof ActionMap<AdminPayload>];

export const AdminInitialState: TAdminReducerState = {
  access_token_admin: "",
  emailAdmin: "",
  usernameAdmin: "",
  users: null,
  services: [],
  premiumInformation: {
    features: [],
    price: 0,
    setting_code: "",
    terms: "",
  },
  subscriberSettings: [],
  userStatistics: {
    IMAGE_UPLOAD: null,
    ACCOUNT_CLOSED: null,
    SUBSCRIPTION_CLOSED: null,
    FREE_ACCOUNT: null,
    NEW_SUBSCRIPTION: null
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
    case AdminTypes.GET_ALL_USERS:
      action.payload.map((user) => {
        if (!user.dentist_name) user.dentist_name = user.email;
      });
      return {...state, users: action.payload};
    case AdminTypes.UPDATE_USER:
      const usersUpdated = state.users!.map((item: IAdminUser) => {
        if (item.gdc === action.payload.gdc) return action.payload;
        return item;
      });
      return {...state, users: usersUpdated};
    case AdminTypes.DELETE_USER:
      const userDeleted = state.users!.filter((user: IAdminUser) => user.gdc !== action.payload);
      return {...state, users: userDeleted};
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
    case AdminTypes.GET_USER_STATISTICS:
      const IMAGE_UPLOAD = action.payload.filter((item) => item.type === "IMAGE_UPLOAD");
      const ACCOUNT_CLOSED = action.payload.filter((item) => item.type === "ACCOUNT_CLOSED");
      const SUBSCRIPTION_CLOSED = action.payload.filter((item) => item.type === "SUBSCRIPTION_CLOSED");
      const FREE_ACCOUNT = action.payload.filter((item) => item.type === "FREE_ACCOUNT");
      const NEW_SUBSCRIPTION = action.payload.filter((item) => item.type === "NEW_SUBSCRIPTION");
      const data = {IMAGE_UPLOAD, ACCOUNT_CLOSED, SUBSCRIPTION_CLOSED, FREE_ACCOUNT, NEW_SUBSCRIPTION}
      return {...state, userStatistics: data};
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
