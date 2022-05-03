import {ActionMap, ISubSettings} from "./types";

export enum UserTypes {
  SET_ALL_SETTINGS = "SET_ALL_SETTINGS",
}

// USER_DATA_LAKE
type UserPayload = {
  [UserTypes.SET_ALL_SETTINGS]: { premium: ISubSettings, free: ISubSettings };
};

export type TUserReducerState = {
  settings: { premium: ISubSettings, free: ISubSettings };
};

export type UserActions =
  ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const UserInitialState: TUserReducerState = {
  settings: {
    premium: {
      appearVerifiedAllowed: false,
      maxLocations: 0,
      maxService: 0,
      phoneAllowed: false,
      subscription_type: 'PREMIUM',
      websiteAllowed: false
    }, free: {
      appearVerifiedAllowed: false,
      maxLocations: 0,
      maxService: 0,
      phoneAllowed: false,
      subscription_type: 'FREE',
      websiteAllowed: false
    }
  },
};

export const userReducer = (state: TUserReducerState, action: UserActions): TUserReducerState => {
  switch (action.type) {
    case UserTypes.SET_ALL_SETTINGS:
      return {settings: action.payload};
    default:
      return state;
  }
};
