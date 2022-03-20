import {
  ActionMap,
  IDentistBio,
  IDentistGallery,
  IDentistLocations,
  IServices,
  Null_Or_,
} from "./types";

export enum DentistTypes {
  SET_ALL_DENTISTS = "SET_ALL_DENTISTS",
  RESET = "RESET_USER",
}

// DENTIST_DATA_LAKE
type DentistPayload = {
  [DentistTypes.RESET]: undefined;
  [DentistTypes.SET_ALL_DENTISTS]: any[];
};

type DentistAccountInfo = {
  accountType: "free" | "premium";
  avatar_url: Null_Or_<string>;
  cover_url: Null_Or_<string>;
};

export type TDentistReducerStateOneItem = IDentistBio &
  IDentistLocations &
  IServices &
  DentistAccountInfo &
  IDentistGallery;

export type TDentistReducerState = {
  dentists: TDentistReducerStateOneItem[];
};

export type DentistActions =
  ActionMap<DentistPayload>[keyof ActionMap<DentistPayload>];

export const DentistInitialState: TDentistReducerState = {
  dentists: [],
};

export const dentistReducer = (
  state: TDentistReducerState,
  action: DentistActions
): TDentistReducerState => {
  switch (action.type) {
    case DentistTypes.SET_ALL_DENTISTS:
      return { dentists: [] };
    case DentistTypes.RESET:
      return { dentists: [] };
    default:
      return state;
  }
};
