import {ActionMap, IDentistLocations} from "./types";

export enum UserTypes {
  SET_ALL_DENTISTS = "SET_ALL_DENTISTS",
}

// USER_DATA_LAKE
type UserPayload = {
  [UserTypes.SET_ALL_DENTISTS]: any[];
};

export type TUserReducerStateOneItem = IDentistLocations;

export type TUserReducerState = {
  dentists: TUserReducerStateOneItem[];
};

export type UserActions =
  ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const UserInitialState: TUserReducerState = {
  dentists: [],
};

export const userReducer = (state: TUserReducerState, action: UserActions): TUserReducerState => {
  switch (action.type) {
    case UserTypes.SET_ALL_DENTISTS:
      return {dentists: []};
    default:
      return state;
  }
};
