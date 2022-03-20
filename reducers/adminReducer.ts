import {
  ActionMap,
  IAdminDetails,
  IPremiumInformation,
  ISubSettings,
  IService,
  IAdminMonthStats, IAdminYearStats,
} from "./types";

export enum AdminTypes {
  GET_SUBSCRIBER_SETTINGS = "GET_SUBSCRIBER_SETTINGS",
  GET_SERVICES = "GET_SERVICES",
  DELETE_SERVICE = "DELETE_SERVICE",
}

// ADMIN_DATA_LAKE
type AdminPayload = {
  [AdminTypes.GET_SUBSCRIBER_SETTINGS]: ISubSettings;
  [AdminTypes.GET_SERVICES]: IService[];
  [AdminTypes.DELETE_SERVICE]: { id: string; };
};

export type TAdminReducerState =
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
    username: 'John Doe',
    email: 'test@test.test',
    avatar_url: '',
  },
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
  premiumInformation: {
    features: ['Verification Checkmark'],
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
};

export const adminReducer = (state: TAdminReducerState, action: AdminActions): TAdminReducerState => {
  switch (action.type) {
    case AdminTypes.GET_SUBSCRIBER_SETTINGS:
      return {...state, subscriberSettings: {...action.payload}};
    case AdminTypes.GET_SERVICES:
      return {...state, services: action.payload};
    case AdminTypes.DELETE_SERVICE:
      const filterServices = state.services.filter((item) => item.service_id !== action.payload.id);
      return {...state, services: filterServices};
    default:
      return state;
  }
};
